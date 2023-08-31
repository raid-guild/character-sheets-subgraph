import {
  CharacterSheetsCreated as CharacterSheetsCreatedEvent,
  CharacterSheetsUpdated as CharacterSheetsUpdatedEvent,
  ClassesCreated as ClassesCreatedEvent,
  ClassesImplementationUpdated as ClassesImplementationUpdatedEvent,
  ERC6551AccountImplementationUpdated as ERC6551AccountImplementationUpdatedEvent,
  ExperienceAndItemsCreated as ExperienceAndItemsCreatedEvent,
  ExperienceUpdated as ExperienceUpdatedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RegistryUpdated as RegistryUpdatedEvent
} from "../generated/CharacterSheetsFactory/CharacterSheetsFactory"
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
} from "../generated/schema"

export function handleCharacterSheetsCreated(
  event: CharacterSheetsCreatedEvent
): void {
  let entity = new CharacterSheetsCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newCharacterSheets = event.params.newCharacterSheets
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCharacterSheetsUpdated(
  event: CharacterSheetsUpdatedEvent
): void {
  let entity = new CharacterSheetsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newCharacterSheets = event.params.newCharacterSheets

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClassesCreated(event: ClassesCreatedEvent): void {
  let entity = new ClassesCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newClasses = event.params.newClasses
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClassesImplementationUpdated(
  event: ClassesImplementationUpdatedEvent
): void {
  let entity = new ClassesImplementationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newClasses = event.params.newClasses

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleERC6551AccountImplementationUpdated(
  event: ERC6551AccountImplementationUpdatedEvent
): void {
  let entity = new ERC6551AccountImplementationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newImplementation = event.params.newImplementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExperienceAndItemsCreated(
  event: ExperienceAndItemsCreatedEvent
): void {
  let entity = new ExperienceAndItemsCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newExp = event.params.newExp
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExperienceUpdated(event: ExperienceUpdatedEvent): void {
  let entity = new ExperienceUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newExperience = event.params.newExperience

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRegistryUpdated(event: RegistryUpdatedEvent): void {
  let entity = new RegistryUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newRegistry = event.params.newRegistry

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
