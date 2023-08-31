import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CharacterSheetsCreated,
  CharacterSheetsUpdated,
  ClassesCreated,
  ClassesImplementationUpdated,
  ERC6551AccountImplementationUpdated,
  ExperienceAndItemsCreated,
  ExperienceUpdated,
  Initialized,
  OwnershipTransferred,
  RegistryUpdated
} from "../generated/CharacterSheetsFactory/CharacterSheetsFactory"

export function createCharacterSheetsCreatedEvent(
  newCharacterSheets: Address,
  creator: Address
): CharacterSheetsCreated {
  let characterSheetsCreatedEvent = changetype<CharacterSheetsCreated>(
    newMockEvent()
  )

  characterSheetsCreatedEvent.parameters = new Array()

  characterSheetsCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCharacterSheets",
      ethereum.Value.fromAddress(newCharacterSheets)
    )
  )
  characterSheetsCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return characterSheetsCreatedEvent
}

export function createCharacterSheetsUpdatedEvent(
  newCharacterSheets: Address
): CharacterSheetsUpdated {
  let characterSheetsUpdatedEvent = changetype<CharacterSheetsUpdated>(
    newMockEvent()
  )

  characterSheetsUpdatedEvent.parameters = new Array()

  characterSheetsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newCharacterSheets",
      ethereum.Value.fromAddress(newCharacterSheets)
    )
  )

  return characterSheetsUpdatedEvent
}

export function createClassesCreatedEvent(
  newClasses: Address,
  creator: Address
): ClassesCreated {
  let classesCreatedEvent = changetype<ClassesCreated>(newMockEvent())

  classesCreatedEvent.parameters = new Array()

  classesCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "newClasses",
      ethereum.Value.fromAddress(newClasses)
    )
  )
  classesCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return classesCreatedEvent
}

export function createClassesImplementationUpdatedEvent(
  newClasses: Address
): ClassesImplementationUpdated {
  let classesImplementationUpdatedEvent = changetype<
    ClassesImplementationUpdated
  >(newMockEvent())

  classesImplementationUpdatedEvent.parameters = new Array()

  classesImplementationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newClasses",
      ethereum.Value.fromAddress(newClasses)
    )
  )

  return classesImplementationUpdatedEvent
}

export function createERC6551AccountImplementationUpdatedEvent(
  newImplementation: Address
): ERC6551AccountImplementationUpdated {
  let erc6551AccountImplementationUpdatedEvent = changetype<
    ERC6551AccountImplementationUpdated
  >(newMockEvent())

  erc6551AccountImplementationUpdatedEvent.parameters = new Array()

  erc6551AccountImplementationUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newImplementation",
      ethereum.Value.fromAddress(newImplementation)
    )
  )

  return erc6551AccountImplementationUpdatedEvent
}

export function createExperienceAndItemsCreatedEvent(
  newExp: Address,
  creator: Address
): ExperienceAndItemsCreated {
  let experienceAndItemsCreatedEvent = changetype<ExperienceAndItemsCreated>(
    newMockEvent()
  )

  experienceAndItemsCreatedEvent.parameters = new Array()

  experienceAndItemsCreatedEvent.parameters.push(
    new ethereum.EventParam("newExp", ethereum.Value.fromAddress(newExp))
  )
  experienceAndItemsCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return experienceAndItemsCreatedEvent
}

export function createExperienceUpdatedEvent(
  newExperience: Address
): ExperienceUpdated {
  let experienceUpdatedEvent = changetype<ExperienceUpdated>(newMockEvent())

  experienceUpdatedEvent.parameters = new Array()

  experienceUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newExperience",
      ethereum.Value.fromAddress(newExperience)
    )
  )

  return experienceUpdatedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRegistryUpdatedEvent(
  newRegistry: Address
): RegistryUpdated {
  let registryUpdatedEvent = changetype<RegistryUpdated>(newMockEvent())

  registryUpdatedEvent.parameters = new Array()

  registryUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newRegistry",
      ethereum.Value.fromAddress(newRegistry)
    )
  )

  return registryUpdatedEvent
}
