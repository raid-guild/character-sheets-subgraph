import { Address, BigInt, store } from "@graphprotocol/graph-ts";
import {
  Character,
  ClassRequirement,
  HeldItem,
  Item,
  ItemRequirement,
} from "../generated/schema";
import { CharacterSheetsImplementation } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";
import {
  ExperienceAndItemsImplementation,
  ItemTransfered as ItemTransferedEvent,
  ItemClaimableUpdated as ItemClaimableUpdatedEvent,
  ItemRequirementAdded as ItemRequirementAddedEvent,
  ItemRequirementRemoved as ItemRequirementRemovedEvent,
  ClassRequirementAdded as ClassRequirementAddedEvent,
  ClassRequirementRemoved as ClassRequirementRemovedEvent,
  NewItemTypeCreated as NewItemTypeCreatedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from "../generated/templates/ExperienceAndItemsImplementation/ExperienceAndItemsImplementation";

export function handleItemRequirementAdded(
  event: ItemRequirementAddedEvent
): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString());

  let requiredItemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.requiredItemId.toString());

  let requirementId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString())
    .concat("-requires-item-")
    .concat(event.params.requiredItemId.toString());

  let entity = ItemRequirement.load(requirementId);
  if (entity == null) {
    entity = new ItemRequirement(requirementId);
  }

  entity.item = itemId;
  entity.requiredItem = requiredItemId;
  entity.requiredAmount = event.params.requiredAmount;

  entity.save();
}

export function handleItemRequirementRemoved(
  event: ItemRequirementRemovedEvent
): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();

  let requirementId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString())
    .concat("-requires-item-")
    .concat(event.params.requiredItemId.toString());

  store.remove("ItemRequirement", requirementId);
}

export function handleClassRequirementAdded(
  event: ClassRequirementAddedEvent
): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();

  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString());

  let requiredClassId = game
    .toHex()
    .concat("-class-")
    .concat(event.params.requiredClassId.toString());

  let requirementId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString())
    .concat("-requires-class-")
    .concat(event.params.requiredClassId.toString());

  let entity = ClassRequirement.load(requirementId);
  if (entity == null) {
    entity = new ClassRequirement(requirementId);
  }

  entity.item = itemId;
  entity.requiredClass = requiredClassId;

  entity.save();
}

export function handleClassRequirementRemoved(
  event: ClassRequirementRemovedEvent
): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();

  let requirementId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString())
    .concat("-requires-class-")
    .concat(event.params.requiredClassId.toString());

  store.remove("ClassRequirement", requirementId);
}

export function handleItemTransfered(event: ItemTransferedEvent): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString());

  let gameContract = CharacterSheetsImplementation.bind(game);

  let result = gameContract.try_getCharacterIdByNftAddress(
    event.params.character
  );

  if (result.reverted) {
    return;
  }

  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(result.value.toString());

  let heldItemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString())
    .concat("-held-by-")
    .concat(result.value.toString());

  let entity = HeldItem.load(heldItemId);
  if (entity == null) {
    entity = new HeldItem(heldItemId);
    entity.amount = BigInt.fromI32(0);
  }

  entity.item = itemId;
  entity.character = characterId;
  let amount = entity.amount;
  amount = amount.plus(event.params.amount);
  entity.amount = amount;

  entity.save();
}

export function handleItemClaimableUpdated(
  event: ItemClaimableUpdatedEvent
): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString());

  let entity = Item.load(itemId);
  if (entity == null) {
    return;
  }

  entity.merkleRoot = event.params.merkleRoot;
  entity.save();
}

export function handleNewItemTypeCreated(event: NewItemTypeCreatedEvent): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.itemId.toString());

  let entity = new Item(itemId);
  entity.itemId = event.params.itemId;

  entity.name = event.params.name;
  entity.game = game.toHex();
  entity.uri = "";

  let result = contract.try_uri(event.params.itemId);
  if (!result.reverted) {
    entity.uri = result.value;
  }

  let item = contract.items(event.params.itemId);

  entity.merkleRoot = item.getClaimable();

  entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  // TODO: implement for items
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  // TODO: implement for items
  if (event.params.id != BigInt.fromI32(0)) {
    return;
  }

  if (event.params.from != Address.fromI32(0)) {
    return;
  }

  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();

  let gameContract = CharacterSheetsImplementation.bind(game);

  let result = gameContract.try_getCharacterIdByNftAddress(event.params.to);

  if (result.reverted) {
    return;
  }

  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(result.value.toString());

  let entity = Character.load(characterId);

  if (entity == null) {
    return;
  }

  let experience = entity.experience;
  experience = experience.plus(event.params.amount);
  entity.experience = experience;

  entity.save();
}

export function handleURI(event: URIEvent): void {
  let contract = ExperienceAndItemsImplementation.bind(event.address);
  let game = contract.characterSheets();
  let itemId = game
    .toHex()
    .concat("-item-")
    .concat(event.params.id.toString());

  let entity = Item.load(itemId);
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
