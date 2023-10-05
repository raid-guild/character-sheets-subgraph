import { Address, BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts";
import {
  CharacterSheetsCreated as CharacterSheetsCreatedEvent,
  Initialized as InitializedEvent,
} from "../generated/CharacterSheetsFactory/CharacterSheetsFactory";
import { Game, Global } from "../generated/schema";
import {
  CharacterSheetsImplementation as CharacterSheetsTemplate,
  ClassesImplementation as ClassesTemplate,
  ItemsImplementation as ItemsTemplate,
  ExperienceImplementation as ExperienceTemplate,
} from "../generated/templates";

import { CharacterSheetsImplementation as CharacterSheetsContract } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";
import { ClassesImplementation } from "../generated/templates/ClassesImplementation/ClassesImplementation";

export function handleCharacterSheetsCreated(
  event: CharacterSheetsCreatedEvent
): void {
  let entity = new Game(event.params.characterSheets.toHex());

  entity.classesAddress = event.params.classes;
  entity.itemsAddress = event.params.items;
  entity.experienceAddress = event.params.experience;
  entity.createdBy = event.params.creator;
  entity.createdAt = event.block.timestamp;
  entity.uri = "";
  entity.eligibilityAdapter = Address.fromI32(0);
  entity.classlevelAdapter = Address.fromI32(0);
  entity.experience = BigInt.fromI32(0);
  entity.owners = new Array<Bytes>();
  entity.masters = new Array<Bytes>();
  entity.save();

  CharacterSheetsTemplate.create(event.params.characterSheets);
  ClassesTemplate.create(event.params.classes);
  ItemsTemplate.create(event.params.items);
  ExperienceTemplate.create(event.params.experience);

  let contract = CharacterSheetsContract.bind(event.params.characterSheets);

  let eligibilityAdapterResult = contract.try_eligibilityAdaptor();
  if (!eligibilityAdapterResult.reverted) {
    entity.eligibilityAdapter = eligibilityAdapterResult.value;
  }

  let uriResult = contract.try_metadataURI();
  if (!uriResult.reverted) {
    entity.uri = uriResult.value;
  }

  let classesContract = ClassesImplementation.bind(event.params.classes);

  let classlevelAdapterResult = classesContract.try_classLevelAdaptor();
  if (!classlevelAdapterResult.reverted) {
    entity.classlevelAdapter = classlevelAdapterResult.value;
  }

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Global(dataSource.network().toString());
  entity.gameFactory = event.address;

  entity.save();
}
