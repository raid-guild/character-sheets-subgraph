import {
  ApprovalForAll as ApprovalForAllEvent,
  Initialized as InitializedEvent,
  ItemTransfered as ItemTransferedEvent,
  ItemUpdated as ItemUpdatedEvent,
  NewItemTypeCreated as NewItemTypeCreatedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from "../generated/ExperienceAndItemsImplementation/ExperienceAndItemsImplementation";
import {
  ExperienceAndItemsImplementationApprovalForAll as ApprovalForAll,
  ExperienceAndItemsImplementationInitialized as Initialized,
  ItemTransfered,
  ItemUpdated,
  NewItemTypeCreated,
  TransferBatch,
  TransferSingle,
  URI,
} from "../generated/schema";

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemTransfered(event: ItemTransferedEvent): void {
  let entity = new ItemTransfered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.itemTransferedTo = event.params.itemTransferedTo;
  entity.itemId = event.params.itemId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  let entity = new ItemUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.itemId = event.params.itemId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNewItemTypeCreated(event: NewItemTypeCreatedEvent): void {
  let entity = new NewItemTypeCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.itemId = event.params.itemId;
  entity.name = event.params.name;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.operator = event.params.operator;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.ids = event.params.ids;
  entity.amounts = event.params.amounts;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.operator = event.params.operator;
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.ExperienceAndItemsImplementation_id = event.params.id;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.value = event.params.value;
  entity.ExperienceAndItemsImplementation_id = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
