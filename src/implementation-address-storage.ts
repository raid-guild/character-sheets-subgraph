import { dataSource } from "@graphprotocol/graph-ts";
import {
  CharacterSheetsUpdated as CharacterSheetsUpdatedEvent,
  ExperienceUpdated as ExperienceUpdatedEvent,
  ItemsUpdated as ItemsUpdatedEvent,
  ClassesImplementationUpdated as ClassesImplementationUpdatedEvent,
  ItemsManagerUpdated as ItemsManagerUpdatedEvent,
  HatsAdaptorUpdated as HatsAdaptorUpdatedEvent,
} from "../generated/templates/ImplementationAddressStorage/ImplementationAddressStorage";
import { ImplementationContracts } from "../generated/schema";

export function handleCharacterSheetsUpdated(
  event: CharacterSheetsUpdatedEvent
): void {
  let entity = ImplementationContracts.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.characterSheetsImplementation = event.params.newCharacterSheets;
  entity.save();
}

export function handleExperienceUpdated(event: ExperienceUpdatedEvent): void {
  let entity = ImplementationContracts.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.experienceImplementation = event.params.newExperience;
  entity.save();
}

export function handleItemsUpdated(event: ItemsUpdatedEvent): void {
  let entity = ImplementationContracts.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.itemsImplementation = event.params.newItems;
  entity.save();
}

export function handleClassesImplementationUpdated(
  event: ClassesImplementationUpdatedEvent
): void {
  let entity = ImplementationContracts.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.classesImplementation = event.params.newClasses;
  entity.save();
}

export function handleItemsManagerUpdated(
  event: ItemsManagerUpdatedEvent
): void {
  let entity = ImplementationContracts.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.itemsManagerImplementation = event.params.newItemsManager;
  entity.save();
}

export function handleHatsAdaptorUpdated(event: HatsAdaptorUpdatedEvent): void {
  let entity = ImplementationContracts.load(dataSource.network().toString());
  if (entity == null) {
    return;
  }

  entity.hatsAdaptorImplementation = event.params.newHatsAdaptor;
  entity.save();
}
