import {
  NewClassCreated as NewClassCreatedEvent,
  ClassAssigned as ClassAssignedEvent,
  ClassLeveled as ClassLeveledEvent,
  ClassRevoked as ClassRevokedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
  ClassesImplementation,
} from "../generated/templates/ClassesImplementation/ClassesImplementation";
import { Class, HeldClass } from "../generated/schema";
import { BigInt, store } from "@graphprotocol/graph-ts";
import { CharacterSheetsImplementation } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";

export function handleClassAssigned(event: ClassAssignedEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();
  let classId = game
    .toHex()
    .concat("-class-")
    .concat(event.params.classId.toHex());

  let gameContract = CharacterSheetsImplementation.bind(game);

  let characterIdResult = gameContract.try_getCharacterIdByAccountAddress(
    event.params.character
  );

  if (characterIdResult.reverted) {
    return;
  }

  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(characterIdResult.value.toHex());

  let heldClassId = game
    .toHex()
    .concat("-class-")
    .concat(
      event.params.classId
        .toHex()
        .concat("-held-by-")
        .concat(event.params.character.toHex())
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

  let gameContract = CharacterSheetsImplementation.bind(game);

  let characterIdResult = gameContract.try_getCharacterIdByAccountAddress(
    event.params.character
  );

  if (characterIdResult.reverted) {
    return;
  }

  let heldClassId = game
    .toHex()
    .concat("-class-")
    .concat(
      event.params.classId
        .toHex()
        .concat("-held-by-")
        .concat(event.params.character.toHex())
    );

  store.remove("HeldClass", heldClassId);
}

export function handleClassLeveled(event: ClassLeveledEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();

  let gameContract = CharacterSheetsImplementation.bind(game);

  let characterIdResult = gameContract.try_getCharacterIdByAccountAddress(
    event.params.character
  );

  if (characterIdResult.reverted) {
    return;
  }

  let heldClassId = game
    .toHex()
    .concat("-class-")
    .concat(
      event.params.classId
        .toHex()
        .concat("-held-by-")
        .concat(event.params.character.toHex())
    );

  let entity = HeldClass.load(heldClassId);
  if (entity == null) {
    return;
  }

  entity.amount = event.params.newLevel;
  entity.save();
}

export function handleNewClassCreated(event: NewClassCreatedEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();
  let classId = game
    .toHex()
    .concat("-class-")
    .concat(event.params.tokenId.toHex());

  let entity = new Class(classId);
  entity.classId = event.params.tokenId;
  entity.game = game.toHex();
  entity.uri = "";

  let result = contract.try_uri(event.params.tokenId);
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
  let classId = game.toHex().concat("-class-").concat(event.params.id.toHex());

  let entity = Class.load(classId);
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
