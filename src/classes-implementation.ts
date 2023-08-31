import { BigInt } from "@graphprotocol/graph-ts";
import {
  ApprovalForAll as ApprovalForAllEvent,
  ClassAssigned as ClassAssignedEvent,
  Initialized as InitializedEvent,
  NewClassCreated as NewClassCreatedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from "../generated/ClassesImplementation/ClassesImplementation";
import {
  ClassesImplementationApprovalForAll as ApprovalForAll,
  ClassAssigned,
  ClassesImplementationInitialized as Initialized,
  NewClassCreated,
  ClassesImplementationTransferBatch as TransferBatch,
  ClassesImplementationTransferSingle as TransferSingle,
  ClassesImplementationURI as URI,
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

export function handleClassAssigned(event: ClassAssignedEvent): void {
  let entity = new ClassAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.classAssignedTo = event.params.classAssignedTo;
  entity.erc1155TokenId = event.params.erc1155TokenId;
  entity.classId = event.params.classId;

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

export function handleNewClassCreated(event: NewClassCreatedEvent): void {
  let entity = new NewClassCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.erc1155TokenId = event.params.erc1155TokenId;
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
  entity.ClassesImplementation_id = event.params.id;
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
  entity.ClassesImplementation_id = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
