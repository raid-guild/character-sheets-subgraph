import { Item } from "../generated/schema";
import {
  ExperienceAndItemsImplementation,
  ItemTransfered as ItemTransferedEvent,
  ItemUpdated as ItemUpdatedEvent,
  NewItemTypeCreated as NewItemTypeCreatedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from "../generated/templates/ExperienceAndItemsImplementation/ExperienceAndItemsImplementation";

export function handleItemTransfered(event: ItemTransferedEvent): void {
  // TODO: implement
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  // TODO: implement
}

export function handleNewItemTypeCreated(event: NewItemTypeCreatedEvent): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString());

  let entity = new Item(itemId);
  entity.itemId = event.params.itemId;

  entity.name = event.params.name;
  entity.game = game.toHex();
  entity.uri = "";

  let result = contract.try_uri(event.params.itemId);
  if (!result.reverted) {
    entity.uri = result.value;
  }

  entity.holders = new Array<string>();

  entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  // TODO: implement
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  // TODO: implement
}

export function handleURI(event: URIEvent): void {
  // TODO: implement
}
