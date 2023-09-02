import {
  CharacterNameUpdated as CharacterNameUpdatedEvent,
  ClassEquipped as ClassEquippedEvent,
  ExperienceUpdated as ExperienceUpdatedEvent,
  ItemEquipped as ItemEquippedEvent,
  MetadataUpdate as MetadataUpdateEvent,
  NewCharacterSheetRolled as NewCharacterSheetRolledEvent,
  PlayerRemoved as PlayerRemovedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent,
  CharacterSheetsImplementation,
} from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";
import { Character, Game } from "../generated/schema";
import { BigInt, store } from "@graphprotocol/graph-ts";

export function handleCharacterNameUpdated(
  event: CharacterNameUpdatedEvent
): void {
  // TODO: implement, needs update to ABI
}

export function handleClassEquipped(event: ClassEquippedEvent): void {
  let entity = Character.load(
    event.address
      .toHex()
      .concat("-character-")
      .concat(event.params.characterId.toHex())
  );
  if (entity == null) {
    return;
  }

  let classId = event.address
    .toHex()
    .concat("-class-")
    .concat(event.params.classId.toHex());

  let equippedClasses = entity.equippedClasses;
  equippedClasses.push(classId);
  entity.equippedClasses = equippedClasses;

  entity.save();
}

export function handleExperienceUpdated(event: ExperienceUpdatedEvent): void {
  let entity = Game.load(event.address.toHex());
  if (entity == null) {
    return;
  }
  entity.itemsAddress = event.params.exp;
  entity.save();
}

export function handleItemEquipped(event: ItemEquippedEvent): void {
  let entity = Character.load(
    event.address
      .toHex()
      .concat("-character-")
      .concat(event.params.characterId.toHex())
  );
  if (entity == null) {
    return;
  }

  let itemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemTokenId.toHex());

  let equippedItems = entity.equippedItems;
  equippedItems.push(itemId);
  entity.equippedItems = equippedItems;

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
  let result0 = contract.try_tokenURI(event.params._tokenId);
  if (!result0.reverted) {
    entity.uri = result0.value;
  }

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
  entity.owner = event.params.member;
  entity.account = event.params.erc6551;
  entity.uri = ""; // TODO: get uri from event
  entity.game = event.address.toHex();
  entity.experience = BigInt.fromI32(0);
  entity.equippedItems = new Array<string>();
  entity.equippedClasses = new Array<string>();
  entity.createdAt = event.block.timestamp;
  entity.createdBy = event.transaction.from;

  let contract = CharacterSheetsImplementation.bind(event.address);
  let result0 = contract.try_tokenURI(event.params.tokenId);
  if (!result0.reverted) {
    entity.uri = result0.value;
  }

  let result1 = contract.try_getCharacterSheetByCharacterId(
    event.params.tokenId
  );
  if (!result1.reverted) {
    entity.name = result1.value.name;
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
