import {
  ClassAssigned as ClassAssignedEvent,
  ClassRevoked as ClassRevokedEvent,
  NewClassCreated as NewClassCreatedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
  ClassesImplementation,
} from "../generated/templates/ClassesImplementation/ClassesImplementation";
import { Class, HeldClass } from "../generated/schema";
import { BigInt, store } from "@graphprotocol/graph-ts";

export function handleClassAssigned(event: ClassAssignedEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();
  let classId = game
    .toHex()
    .concat("-class-")
    .concat(event.params.classId.toString());

  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(event.params.characterId.toString());

  let heldClassId = game
    .toHex()
    .concat("-class-")
    .concat(
      event.params.classId
        .toString()
        .concat("-held-by-")
        .concat(event.params.characterId.toString())
    );

  let entity = HeldClass.load(heldClassId);
  if (entity == null) {
    entity = new HeldClass(heldClassId);
    entity.amount = BigInt.fromI32(0);
  }

  entity.classEntity = classId;
  entity.character = characterId;
  let amount = entity.amount;
  amount = amount.plus(BigInt.fromI32(1));
  entity.amount = amount;

  entity.save();
}

export function handleClassRevoked(event: ClassRevokedEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();

  let heldClassId = game
    .toHex()
    .concat("-class-")
    .concat(
      event.params.classId
        .toString()
        .concat("-held-by-")
        .concat(event.params.characterId.toString())
    );

  store.remove("HeldClass", heldClassId);
}

export function handleNewClassCreated(event: NewClassCreatedEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();
  let classId = game
    .toHex()
    .concat("-class-")
    .concat(event.params.erc1155TokenId.toString());

  let entity = new Class(classId);
  entity.classId = event.params.erc1155TokenId;
  entity.name = event.params.name;
  entity.game = game.toHex();
  entity.uri = "";

  let result = contract.try_uri(event.params.erc1155TokenId);
  if (!result.reverted) {
    entity.uri = result.value;
  }

  entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  // TODO: implement
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  // TODO: implement
}

export function handleURI(event: URIEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();
  let classId = game
    .toHex()
    .concat("-class-")
    .concat(event.params.id.toString());

  let entity = Class.load(classId);
  if (entity == null) {
    return;
  }
  entity.uri = event.params.value;
  entity.save();
}
