import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Item, HeldItem, ItemRequirement } from "../generated/schema";
import { CharacterSheetsImplementation } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";
import {
  ItemsImplementation,
  NewItemTypeCreated as NewItemTypeCreatedEvent,
  ItemClaimableUpdated as ItemClaimableUpdatedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from "../generated/templates/ItemsImplementation/ItemsImplementation";

import { ItemsManagerImplementation } from "../generated/templates/ItemsImplementation/ItemsManagerImplementation";
import { IClonesAddressStorage } from "../generated/templates/ItemsImplementation/IClonesAddressStorage";

function _newItemRequirement(
  gameAddress: Address,
  itemIdBG: BigInt,
  assetCategory: number,
  assetAddress: Address,
  assetIdBG: BigInt,
  amountBG: BigInt
): void {
  let itemId = gameAddress
    .toHex()
    .concat("-item-")
    .concat(itemIdBG.toHex());

  let assetId = assetAddress
    .toHex()
    .concat("-asset-")
    .concat(assetIdBG.toHex());

  let requirementId = gameAddress
    .toHex()
    .concat("-item-")
    .concat(itemIdBG.toHex())
    .concat("-requires-")
    .concat(assetId);

  let entity = ItemRequirement.load(requirementId);
  if (entity == null) {
    entity = new ItemRequirement(requirementId);
  }

  entity.item = itemId;

  let category = "ERC20";
  if (assetCategory == 1) {
    category = "ERC721";
  }
  if (assetCategory == 2) {
    category = "ERC1155";
  }
  entity.assetCategory = category;
  entity.assetAddress = assetAddress;
  entity.assetId = assetIdBG;
  entity.amount = amountBG;

  entity.save();
}

function getGameAddress(itemsAddress: Address): Address {
  let contract = ItemsImplementation.bind(itemsAddress);

  let clones = contract.clones();

  let clonesStorage = IClonesAddressStorage.bind(clones);

  let game = clonesStorage.characterSheets();

  return game;
}

export function handleItemClaimableUpdated(
  event: ItemClaimableUpdatedEvent
): void {
  let game = getGameAddress(event.address);
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex());

  let entity = Item.load(itemId);
  if (entity == null) {
    return;
  }

  entity.merkleRoot = event.params.merkleRoot;
  entity.save();
}

export function handleNewItemTypeCreated(event: NewItemTypeCreatedEvent): void {
  let contract = ItemsImplementation.bind(event.address);

  let game = getGameAddress(event.address);

  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex());

  let entity = new Item(itemId);
  entity.itemId = event.params.itemId;

  entity.game = game.toHex();
  entity.uri = "";

  let result = contract.try_uri(event.params.itemId);
  if (!result.reverted) {
    entity.uri = result.value;
  }

  let item = contract.getItem(event.params.itemId);

  entity.merkleRoot = item.claimable;
  entity.soulbound = item.soulbound;
  entity.supply = item.supply;
  entity.supplied = item.supplied;
  entity.totalSupply = item.supply;

  entity.save();

  let itemsManagerAddress = contract.itemsManager();

  let itemsManager = ItemsManagerImplementation.bind(itemsManagerAddress);

  let requirements = itemsManager.getItemRequirements(event.params.itemId);

  for (let i = 0; i < requirements.length; i++) {
    let requirement = requirements[i];

    _newItemRequirement(
      game,
      event.params.itemId,
      requirement.category,
      requirement.assetAddress,
      requirement.id,
      requirement.amount
    );
  }
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  // TODO: implement for items
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let game = getGameAddress(event.address);

  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.id.toHex());

  let itemEntity = Item.load(itemId);
  if (itemEntity == null) {
    log.error("ItemTransfered: item not found", []);
    return;
  }

  let supply = itemEntity.supply;
  supply = supply.minus(event.params.value);
  itemEntity.supply = supply;
  itemEntity.save();

  let gameContract = CharacterSheetsImplementation.bind(game);

  {
    let result = gameContract.try_getCharacterIdByAccountAddress(
      event.params.to
    );

    if (result.reverted) {
      log.error(
        "TransferSingle: getCharacterIdByAccountAddress reverted for to",
        []
      );
      return;
    }

    let characterId = game
      .toHex()
      .concat("-character-")
      .concat(result.value.toHex());

    let heldItemId = game
      .toHex()
      .concat("-item-")
      .concat(event.params.id.toHex())
      .concat("-held-by-")
      .concat(result.value.toHex());

    let entity = HeldItem.load(heldItemId);
    if (entity == null) {
      entity = new HeldItem(heldItemId);
      entity.amount = BigInt.fromI32(0);
    }

    entity.item = itemId;
    entity.character = characterId;
    let amount = entity.amount;
    amount = amount.plus(event.params.value);
    entity.amount = amount;

    entity.save();
  }

  {
    if (
      event.params.from ==
        Address.fromHexString("0x0000000000000000000000000000000000000000") ||
      event.params.from == event.address
    ) {
      return;
    }
    let result = gameContract.try_getCharacterIdByAccountAddress(
      event.params.from
    );

    if (result.reverted) {
      log.error(
        "TransferSingle: getCharacterIdByAccountAddress reverted for from",
        []
      );
      return;
    }

    let characterId = game
      .toHex()
      .concat("-character-")
      .concat(result.value.toHex());

    let heldItemId = game
      .toHex()
      .concat("-item-")
      .concat(event.params.id.toHex())
      .concat("-held-by-")
      .concat(result.value.toHex());

    let entity = HeldItem.load(heldItemId);
    if (entity == null) {
      entity = new HeldItem(heldItemId);
      entity.amount = BigInt.fromI32(0);
    }

    entity.item = itemId;
    entity.character = characterId;
    let amount = entity.amount;
    if (amount.lt(event.params.value)) {
      log.error("TransferSingle: amount is less than value", []);
      return;
    }
    amount = amount.minus(event.params.value);
    entity.amount = amount;

    entity.save();
  }
}

export function handleURI(event: URIEvent): void {
  let contract = ItemsImplementation.bind(event.address);

  let game = getGameAddress(event.address);
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.id.toHex());

  let entity = Item.load(itemId);
  if (entity == null) {
    return;
  }

  let result = contract.try_uri(event.params.id);
  if (result.reverted) {
    return;
  }

  entity.uri = result.value;
  entity.save();
}
