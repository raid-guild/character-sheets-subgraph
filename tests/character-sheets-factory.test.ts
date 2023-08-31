import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CharacterSheetsCreated } from "../generated/schema"
import { CharacterSheetsCreated as CharacterSheetsCreatedEvent } from "../generated/CharacterSheetsFactory/CharacterSheetsFactory"
import { handleCharacterSheetsCreated } from "../src/character-sheets-factory"
import { createCharacterSheetsCreatedEvent } from "./character-sheets-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newCharacterSheets = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newCharacterSheetsCreatedEvent = createCharacterSheetsCreatedEvent(
      newCharacterSheets,
      creator
    )
    handleCharacterSheetsCreated(newCharacterSheetsCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CharacterSheetsCreated created and stored", () => {
    assert.entityCount("CharacterSheetsCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CharacterSheetsCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newCharacterSheets",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CharacterSheetsCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
