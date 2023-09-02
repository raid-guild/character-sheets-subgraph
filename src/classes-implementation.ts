import {
  ClassAssigned as ClassAssignedEvent,
  NewClassCreated as NewClassCreatedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
  ClassesImplementation,
} from "../generated/templates/ClassesImplementation/ClassesImplementation";
import { Class } from "../generated/schema";
import { CharacterSheetsImplementation } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";

export function handleClassAssigned(event: ClassAssignedEvent): void {
  let contract = ClassesImplementation.bind(event.address);
  let game = contract.characterSheets();
  let classId = game
    .toHex()
    .concat("-class-")
    .concat(event.params.erc1155TokenId.toString());

  let entity = Class.load(classId);
  if (entity == null) {
    return;
  }

  let gameContract = CharacterSheetsImplementation.bind(game);
  let result = gameContract.try_getCharacterIdByNftAddress(
    event.params.classAssignedTo
  );

  if (result.reverted) {
    return;
  }
  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(result.value.toString());

  entity.holders.push(characterId);

  entity.save();
}

// TODO add handler for ClassUnassigned, but it's not in the ABI

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
