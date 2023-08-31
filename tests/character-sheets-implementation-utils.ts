import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  CharacterNameUpdated,
  ClassEquipped,
  ExperienceUpdated,
  Initialized,
  ItemEquipped,
  MetadataUpdate,
  NewCharacter,
  NewPlayer,
  PlayerJailed,
  PlayerRemoved,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/CharacterSheetsImplementation/CharacterSheetsImplementation"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createCharacterNameUpdatedEvent(
  oldName: string,
  newName: string
): CharacterNameUpdated {
  let characterNameUpdatedEvent = changetype<CharacterNameUpdated>(
    newMockEvent()
  )

  characterNameUpdatedEvent.parameters = new Array()

  characterNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("oldName", ethereum.Value.fromString(oldName))
  )
  characterNameUpdatedEvent.parameters.push(
    new ethereum.EventParam("newName", ethereum.Value.fromString(newName))
  )

  return characterNameUpdatedEvent
}

export function createClassEquippedEvent(
  characterId: BigInt,
  classId: BigInt
): ClassEquipped {
  let classEquippedEvent = changetype<ClassEquipped>(newMockEvent())

  classEquippedEvent.parameters = new Array()

  classEquippedEvent.parameters.push(
    new ethereum.EventParam(
      "characterId",
      ethereum.Value.fromUnsignedBigInt(characterId)
    )
  )
  classEquippedEvent.parameters.push(
    new ethereum.EventParam(
      "classId",
      ethereum.Value.fromUnsignedBigInt(classId)
    )
  )

  return classEquippedEvent
}

export function createExperienceUpdatedEvent(exp: Address): ExperienceUpdated {
  let experienceUpdatedEvent = changetype<ExperienceUpdated>(newMockEvent())

  experienceUpdatedEvent.parameters = new Array()

  experienceUpdatedEvent.parameters.push(
    new ethereum.EventParam("exp", ethereum.Value.fromAddress(exp))
  )

  return experienceUpdatedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createItemEquippedEvent(
  characterId: BigInt,
  itemTokenId: BigInt
): ItemEquipped {
  let itemEquippedEvent = changetype<ItemEquipped>(newMockEvent())

  itemEquippedEvent.parameters = new Array()

  itemEquippedEvent.parameters.push(
    new ethereum.EventParam(
      "characterId",
      ethereum.Value.fromUnsignedBigInt(characterId)
    )
  )
  itemEquippedEvent.parameters.push(
    new ethereum.EventParam(
      "itemTokenId",
      ethereum.Value.fromUnsignedBigInt(itemTokenId)
    )
  )

  return itemEquippedEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
}

export function createNewCharacterEvent(
  tokenId: BigInt,
  tba: Address
): NewCharacter {
  let newCharacterEvent = changetype<NewCharacter>(newMockEvent())

  newCharacterEvent.parameters = new Array()

  newCharacterEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  newCharacterEvent.parameters.push(
    new ethereum.EventParam("tba", ethereum.Value.fromAddress(tba))
  )

  return newCharacterEvent
}

export function createNewPlayerEvent(
  tokenId: BigInt,
  memberAddress: Address
): NewPlayer {
  let newPlayerEvent = changetype<NewPlayer>(newMockEvent())

  newPlayerEvent.parameters = new Array()

  newPlayerEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  newPlayerEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )

  return newPlayerEvent
}

export function createPlayerJailedEvent(
  playerAddress: Address,
  thrownInJail: boolean
): PlayerJailed {
  let playerJailedEvent = changetype<PlayerJailed>(newMockEvent())

  playerJailedEvent.parameters = new Array()

  playerJailedEvent.parameters.push(
    new ethereum.EventParam(
      "playerAddress",
      ethereum.Value.fromAddress(playerAddress)
    )
  )
  playerJailedEvent.parameters.push(
    new ethereum.EventParam(
      "thrownInJail",
      ethereum.Value.fromBoolean(thrownInJail)
    )
  )

  return playerJailedEvent
}

export function createPlayerRemovedEvent(tokenId: BigInt): PlayerRemoved {
  let playerRemovedEvent = changetype<PlayerRemoved>(newMockEvent())

  playerRemovedEvent.parameters = new Array()

  playerRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return playerRemovedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
