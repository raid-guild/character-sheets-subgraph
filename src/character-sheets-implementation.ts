import {
  CharacterNameUpdated as CharacterNameUpdatedEvent,
  ClassEquipped as ClassEquippedEvent,
  ItemEquipped as ItemEquippedEvent,
  ClassUnequipped as ClassUnequippedEvent,
  ItemUnequipped as ItemUnequippedEvent,
  ExperienceUpdated as ExperienceUpdatedEvent,
  MetadataUpdate as MetadataUpdateEvent,
  MetadataURIUpdated as MetadataURIUpdatedEvent,
  NewCharacterSheetRolled as NewCharacterSheetRolledEvent,
  PlayerRemoved as PlayerRemovedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent,
  CharacterSheetsImplementation,
} from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";
import {
  Character,
  EquippedClass,
  EquippedItem,
  Game,
} from "../generated/schema";
import { BigInt, store } from "@graphprotocol/graph-ts";

export function handleCharacterNameUpdated(
  event: CharacterNameUpdatedEvent
): void {
  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(event.params.tokenId.toHex());

  let character = Character.load(characterId);

  if (character == null) {
    return;
  }

  character.name = event.params.newName;
  character.save();
}

export function handleClassEquipped(event: ClassEquippedEvent): void {
  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(event.params.characterId.toHex());

  let classId = event.address
    .toHex()
    .concat("-class-")
    .concat(event.params.classId.toHex());

  let heldClassId = event.address
    .toHex()
    .concat("-class-")
    .concat(event.params.classId.toString())
    .concat("-held-by-")
    .concat(event.params.characterId.toString());

  let equippedClassId = event.address
    .toHex()
    .concat("-class-")
    .concat(event.params.classId.toString())
    .concat("-equipped-by-")
    .concat(event.params.characterId.toString());

  let equippedClass = EquippedClass.load(equippedClassId);
  if (equippedClass == null) {
    equippedClass = new EquippedClass(equippedClassId);
  }

  equippedClass.character = characterId;
  equippedClass.classEntity = classId;
  equippedClass.heldClass = heldClassId;
  equippedClass.save();
}

export function handleClassUnequipped(event: ClassUnequippedEvent): void {
  let equippedClassId = event.address
    .toHex()
    .concat("-class-")
    .concat(event.params.classId.toString())
    .concat("-equipped-by-")
    .concat(event.params.characterId.toString());

  store.remove("EquippedClass", equippedClassId);
}

export function handleItemEquipped(event: ItemEquippedEvent): void {
  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(event.params.characterId.toHex());

  let itemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemTokenId.toHex());

  let heldItemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemTokenId.toString())
    .concat("-held-by-")
    .concat(event.params.characterId.toString());

  let equippedItemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemTokenId.toString())
    .concat("-equipped-by-")
    .concat(event.params.characterId.toString());

  let equippedItem = EquippedItem.load(equippedItemId);
  if (equippedItem == null) {
    equippedItem = new EquippedItem(equippedItemId);
  }

  equippedItem.character = characterId;
  equippedItem.item = itemId;
  equippedItem.heldItem = heldItemId;
  equippedItem.save();
}

export function handleItemUnequipped(event: ItemUnequippedEvent): void {
  let equippedItemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemTokenId.toString())
    .concat("-equipped-by-")
    .concat(event.params.characterId.toString());

  store.remove("EquippedItem", equippedItemId);
}

export function handleExperienceUpdated(event: ExperienceUpdatedEvent): void {
  let entity = Game.load(event.address.toHex());
  if (entity == null) {
    return;
  }
  entity.itemsAddress = event.params.exp;
  entity.save();
}

export function handleMetadataUpdate(event: MetadataUpdateEvent): void {
  let entity = Character.load(
    event.address
      .toHex()
      .concat("-character-")
      .concat(event.params._tokenId.toHex())
  );
  if (entity == null) {
    return;
  }

  let contract = CharacterSheetsImplementation.bind(event.address);
  let result = contract.try_tokenURI(event.params._tokenId);
  if (!result.reverted) {
    entity.uri = result.value;
  }

  entity.save();
}

export function handleMetadataURIUpdated(event: MetadataURIUpdatedEvent): void {
  let entity = Game.load(event.address.toHex());
  if (entity == null) {
    return;
  }

  entity.uri = event.params.newURI;
  entity.save();
}

export function handleNewCharacterSheetRolled(
  event: NewCharacterSheetRolledEvent
): void {
  let entity = new Character(
    event.address
      .toHex()
      .concat("-character-")
      .concat(event.params.tokenId.toHex())
  );

  entity.name = ""; // TODO: get name from event
  entity.characterId = event.params.tokenId;
  entity.player = event.params.member;
  entity.account = event.params.erc6551;
  entity.uri = ""; // TODO: get uri from event
  entity.game = event.address.toHex();
  entity.experience = BigInt.fromI32(0);
  entity.createdAt = event.block.timestamp;
  entity.createdBy = event.transaction.from;

  let contract = CharacterSheetsImplementation.bind(event.address);
  let uriResult = contract.try_tokenURI(event.params.tokenId);
  if (!uriResult.reverted) {
    entity.uri = uriResult.value;
  }

  let characterResult = contract.try_getCharacterSheetByCharacterId(
    event.params.tokenId
  );
  if (!characterResult.reverted) {
    entity.name = characterResult.value.name;
  }

  entity.save();
}

export function handlePlayerRemoved(event: PlayerRemovedEvent): void {
  store.remove(
    "Character",
    event.address
      .toHex()
      .concat("-character-")
      .concat(event.params.tokenId.toHex())
  );
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = Game.load(event.address.toHex());

  if (entity == null) {
    return;
  }

  let contract = CharacterSheetsImplementation.bind(event.address);
  let DEFAULT_ADMIN_ROLE = contract.DEFAULT_ADMIN_ROLE();
  let DUNGEON_MASTER = contract.DUNGEON_MASTER();

  if (event.params.role == DEFAULT_ADMIN_ROLE) {
    let owners = entity.owners;
    owners.push(event.params.account);
    entity.owners = owners;
  } else if (event.params.role == DUNGEON_MASTER) {
    let masters = entity.masters;
    masters.push(event.params.account);
    entity.masters = masters;
  }

  entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = Game.load(event.address.toHex());

  if (entity == null) {
    return;
  }

  let contract = CharacterSheetsImplementation.bind(event.address);
  let DEFAULT_ADMIN_ROLE = contract.DEFAULT_ADMIN_ROLE();
  let DUNGEON_MASTER = contract.DUNGEON_MASTER();

  if (event.params.role == DEFAULT_ADMIN_ROLE) {
    let owners = entity.owners;
    let index = owners.indexOf(event.params.account);
    if (index > -1) {
      owners.splice(index, 1);
    }
    entity.owners = owners;
  } else if (event.params.role == DUNGEON_MASTER) {
    let masters = entity.masters;
    let index = masters.indexOf(event.params.account);
    if (index > -1) {
      masters.splice(index, 1);
    }
    entity.masters = masters;
  }

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  // TODO: implement
  // let entity = Character.load(
  //   event.address
  //     .toHex()
  //     .concat("-character-")
  //     .concat(event.params.tokenId.toHex())
  // );
  // if (entity == null) {
  //   return;
  // }
  // entity.owner = event.params.to;
  // entity.save();
}
