import { Address, BigInt, store, log } from "@graphprotocol/graph-ts";
import {
  Character,
  Game,
  Item,
  HeldItem,
  ItemRequirement,
} from "../generated/schema";
import { CharacterSheetsImplementation } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";
import {
  ItemsImplementation,
  NewItemTypeCreated as NewItemTypeCreatedEvent,
  ItemTransfered as ItemTransferedEvent,
  ItemClaimableUpdated as ItemClaimableUpdatedEvent,
  RequirementAdded as RequirementAddedEvent,
  RequirementRemoved as RequirementRemovedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from "../generated/templates/ItemsImplementation/ItemsImplementation";

export function handleRequirementAdded(event: RequirementAddedEvent): void {
  let contract = ItemsImplementation.bind(event.address);
  let game = contract.characterSheets();

  _newItemRequirement(
    game,
    event.params.itemId,
    event.params.category,
    event.params.assetAddress,
    event.params.assetId,
    event.params.amount
  );
}

function _newItemRequirement(
  gameAddress: Address,
  itemIdBG: BigInt,
  assetCategory: number,
  assetAddress: Address,
  assetIdBG: BigInt,
  amountBG: BigInt
): void {
  let itemId = gameAddress.toHex().concat("-item-").concat(itemIdBG.toHex());

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

  let category = "erc20";
  if (assetCategory == 1) {
    category = "erc721";
  }
  if (assetCategory == 2) {
    category = "erc1155";
  }
  entity.assetCategory = category;
  entity.assetAddress = assetAddress;
  entity.assetId = assetIdBG;
  entity.amount = amountBG;

  entity.save();
}

export function handleRequirementRemoved(event: RequirementRemovedEvent): void {
  let contract = ItemsImplementation.bind(event.address);
  let game = contract.characterSheets();

  let assetId = event.params.assetAddress
    .toHex()
    .concat("-asset-")
    .concat(event.params.assetId.toHex());

  let requirementId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex())
    .concat("-requires-")
    .concat(assetId);

  store.remove("ItemRequirement", requirementId);
}

export function handleItemTransfered(event: ItemTransferedEvent): void {
  let contract = ItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex());

  let itemEntity = Item.load(itemId);
  if (itemEntity == null) {
    log.error("ItemTransfered: item not found", []);
    return;
  }

  let supply = itemEntity.supply;
  supply = supply.minus(event.params.amount);
  itemEntity.supply = supply;
  itemEntity.save();

  let gameContract = CharacterSheetsImplementation.bind(game);

  let result = gameContract.try_getCharacterIdByAccountAddress(
    event.params.character
  );

  if (result.reverted) {
    log.error("ItemTransfered: getCharacterIdByAccountAddress reverted", []);
    return;
  }

  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(result.value.toHex());

  let heldItemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toHex())
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
  amount = amount.plus(event.params.amount);
  entity.amount = amount;

  entity.save();
}

export function handleItemClaimableUpdated(
  event: ItemClaimableUpdatedEvent
): void {
  let contract = ItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
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
  let game = contract.characterSheets();
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
  entity.supply = item.supply;
  entity.supplied = item.supplied;
  entity.totalSupply = item.supply;

  entity.save();

  let requirements = contract.getItemRequirements(event.params.itemId);

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
  // TODO: implement for items
}

export function handleURI(event: URIEvent): void {
  let contract = ItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game.toHex().concat("-item-").concat(event.params.id.toHex());

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
