import { Address, Bytes, dataSource } from "@graphprotocol/graph-ts";
import {
  CharacterSheetsCreated as CharacterSheetsCreatedEvent,
  CharacterSheetsFactory,
  CharacterSheetsUpdated as CharacterSheetsUpdatedEvent,
  ClassesImplementationUpdated as ClassesImplementationUpdatedEvent,
  ERC6551AccountImplementationUpdated as ERC6551AccountImplementationUpdatedEvent,
  ExperienceUpdated as ExperienceUpdatedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RegistryUpdated as RegistryUpdatedEvent,
} from "../generated/CharacterSheetsFactory/CharacterSheetsFactory";
import { Game, Global } from "../generated/schema";
import {
  CharacterSheetsImplementation as CharacterSheetsTemplate,
  ExperienceAndItemsImplementation as ExperienceAndItemsTemplate,
  ClassesImplementation as ClassesTemplate,
} from "../generated/templates";

import { CharacterSheetsImplementation as CharacterSheetsContract } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";

export function handleCharacterSheetsCreated(
  event: CharacterSheetsCreatedEvent
): void {
  let entity = new Game(event.params.characterSheets.toHex());

  entity.characterSheetsAddress = event.params.characterSheets;
  entity.classesAddress = event.params.classes;
  entity.itemsAddress = event.params.experienceAndItems;
  entity.createdBy = event.params.creator;
  entity.createdAt = event.block.timestamp;
  entity.uri = "";
  entity.dao = Address.fromI32(0);
  entity.owners = new Array<Bytes>();
  entity.masters = new Array<Bytes>();
  entity.save();

  CharacterSheetsTemplate.create(event.params.characterSheets);
  ExperienceAndItemsTemplate.create(event.params.experienceAndItems);
  ClassesTemplate.create(event.params.classes);

  let contract = CharacterSheetsContract.bind(event.params.characterSheets);

  let daoResult = contract.try_dao();
  if (!daoResult.reverted) {
    entity.dao = daoResult.value;
  }

  let uriResult = contract.try_baseTokenURI();
  if (!uriResult.reverted) {
    entity.uri = uriResult.value;
  }

  entity.save();
}

export function handleCharacterSheetsUpdated(
  event: CharacterSheetsUpdatedEvent
): void {
  let entity = Global.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.characterSheetsImpl = event.params.newCharacterSheets;
  entity.save();
}

export function handleClassesImplementationUpdated(
  event: ClassesImplementationUpdatedEvent
): void {
  let entity = Global.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.classesImpl = event.params.newClasses;
  entity.save();
}

export function handleERC6551AccountImplementationUpdated(
  event: ERC6551AccountImplementationUpdatedEvent
): void {
  let entity = Global.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.erc6551AccountImpl = event.params.newImplementation;
  entity.save();
}

export function handleExperienceUpdated(event: ExperienceUpdatedEvent): void {
  let entity = Global.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.itemsImpl = event.params.newExperience;
  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Global(dataSource.network().toString());
  entity.gameFactory = event.address;

  entity.characterSheetsImpl = Address.fromI32(0);
  entity.classesImpl = Address.fromI32(0);
  entity.itemsImpl = Address.fromI32(0);
  entity.erc6551AccountImpl = Address.fromI32(0);
  entity.erc6551Registry = Address.fromI32(0);
  entity.owner = Address.fromI32(0);

  let factory = CharacterSheetsFactory.bind(event.address);
  let result = factory.try_owner();
  if (!result.reverted) {
    entity.owner = result.value;
  }

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = Global.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.owner = event.params.newOwner;
  entity.save();
}

export function handleRegistryUpdated(event: RegistryUpdatedEvent): void {
  let entity = Global.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.erc6551Registry = event.params.newRegistry;
  entity.save();
}
