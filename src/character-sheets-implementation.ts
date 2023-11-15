import {
  Approval as ApprovalEvent,
  BaseURIUpdated as BaseURIUpdatedEvent,
  NewCharacterSheetRolled as NewCharacterSheetRolledEvent,
  MetadataURIUpdated as MetadataURIUpdatedEvent,
  CharacterRemoved as CharacterRemovedEvent,
  ItemEquipped as ItemEquippedEvent,
  ItemUnequipped as ItemUnequippedEvent,
  CharacterUpdated as CharacterUpdatedEvent,
  PlayerJailed as PlayerJailedEvent,
  CharacterRestored as CharacterRestoredEvent,
  Transfer as TransferEvent,
  CharacterSheetsImplementation,
} from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";
import { Character, Game, EquippedItem } from "../generated/schema";
import { Address, log, BigInt, store } from "@graphprotocol/graph-ts";

export function handleBaseURIUpdated(event: BaseURIUpdatedEvent): void {
  let game = Game.load(event.address.toHex());
  if (game == null) {
    log.error("BaseURIUpdated: game {} not found", [event.address.toHex()]);
    return;
  }

  game.baseTokenURI = event.params.newURI;
  game.save();

  let contract = CharacterSheetsImplementation.bind(event.address);
  let result = contract.try_totalSheets();
  if (result.reverted) {
    log.error("BaseURIUpdated: totalSheets reverted", []);
    return;
  }

  let totalSheets = result.value;

  for (
    let i = BigInt.fromI32(0);
    i.lt(totalSheets);
    i = i.plus(BigInt.fromI32(1))
  ) {
    let characterId = event.address
      .toHex()
      .concat("-character-")
      .concat(i.toHex());

    let character = Character.load(characterId);
    if (character == null) {
      log.error("BaseURIUpdated: character {} not found", [characterId]);
      continue;
    }

    let result = contract.try_tokenURI(i);
    if (result.reverted) {
      log.error("BaseURIUpdated: tokenURI reverted", []);
      continue;
    }

    character.uri = result.value;
    character.save();
  }
}

export function handleCharacterUpdated(event: CharacterUpdatedEvent): void {
  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(event.params.characterId.toHex());

  let character = Character.load(characterId);

  if (character == null) {
    return;
  }

  let contract = CharacterSheetsImplementation.bind(event.address);
  let result = contract.try_tokenURI(event.params.characterId);
  if (!result.reverted) {
    character.uri = result.value;
  }

  character.save();
}

export function handleItemEquipped(event: ItemEquippedEvent): void {
  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(event.params.characterId.toHex());

  let itemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex());

  let heldItemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex())
    .concat("-held-by-")
    .concat(event.params.characterId.toHex());

  let equippedItemId = event.address
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex())
    .concat("-equipped-by-")
    .concat(event.params.characterId.toHex());

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
    .concat(event.params.itemId.toHex())
    .concat("-equipped-by-")
    .concat(event.params.characterId.toHex());

  store.remove("EquippedItem", equippedItemId);
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
      .concat(event.params.characterId.toHex())
  );

  entity.characterId = event.params.characterId;
  entity.player = event.params.player;
  entity.account = event.params.account;
  entity.game = event.address.toHex();
  entity.experience = BigInt.fromI32(0);
  entity.createdAt = event.block.timestamp;
  entity.createdBy = event.transaction.from;
  entity.jailed = false;
  entity.removed = false;
  entity.approved = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  entity.uri = "";

  let contract = CharacterSheetsImplementation.bind(event.address);
  let uriResult = contract.try_tokenURI(event.params.characterId);
  if (!uriResult.reverted) {
    entity.uri = uriResult.value;
  }

  entity.save();
}

export function handleCharacterRemoved(event: CharacterRemovedEvent): void {
  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(event.params.characterId.toHex());

  let entity = Character.load(characterId);

  if (entity == null) {
    return;
  }

  entity.removed = true;
  entity.save();
}

export function handleCharacterRestored(event: CharacterRestoredEvent): void {
  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(event.params.characterId.toHex());

  let entity = Character.load(characterId);

  if (entity == null) {
    return;
  }

  entity.removed = false;
  entity.save();
}

export function handlePlayerJailed(event: PlayerJailedEvent): void {
  let playerAddress = event.params.playerAddress;
  let isJailed = event.params.thrownInJail;

  let gameContract = CharacterSheetsImplementation.bind(event.address);

  let result = gameContract.try_getCharacterIdByPlayerAddress(playerAddress);

  if (result.reverted) {
    log.error("ItemTransfered: memberAddressToTokenId reverted", []);
    return;
  }

  let characterId = event.address
    .toHex()
    .concat("-character-")
    .concat(result.value.toHex());

  let character = Character.load(characterId);

  if (character == null) {
    return;
  }

  character.jailed = isJailed;
  character.save();
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = Character.load(
    event.address
      .toHex()
      .concat("-character-")
      .concat(event.params.tokenId.toHex())
  );
  if (entity == null) {
    return;
  }
  entity.approved = event.params.approved;
  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = Character.load(
    event.address
      .toHex()
      .concat("-character-")
      .concat(event.params.tokenId.toHex())
  );
  if (entity == null) {
    return;
  }
  if (
    event.params.to ==
    Address.fromHexString("0x0000000000000000000000000000000000000000")
  ) {
    return;
  }
  entity.player = event.params.to;
  entity.approved = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  entity.save();
}
