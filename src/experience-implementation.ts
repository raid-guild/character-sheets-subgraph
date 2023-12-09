import { Address, log } from "@graphprotocol/graph-ts";
import { Character, Game } from "../generated/schema";
import { CharacterSheetsImplementation } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";

import {
  ExperienceImplementation,
  Transfer as TransferEvent,
} from "../generated/templates/ExperienceImplementation/ExperienceImplementation";
import { IClonesAddressStorage } from "../generated/templates/ExperienceImplementation/IClonesAddressStorage";

function getGameAddress(experienceAddress: Address): Address {
  let contract = ExperienceImplementation.bind(experienceAddress);

  let clones = contract.clones();

  let clonesStorage = IClonesAddressStorage.bind(clones);

  let game = clonesStorage.characterSheets();

  return game;
}

export function handleTransfer(event: TransferEvent): void {
  let game = getGameAddress(event.address);
  let gameContract = CharacterSheetsImplementation.bind(game);

  if (
    event.params.to ==
    Address.fromHexString("0x0000000000000000000000000000000000000000")
  ) {
    let characterIdResult = gameContract.try_getCharacterIdByAccountAddress(
      event.params.from
    );

    if (characterIdResult.reverted) {
      log.error("TransferSingle: getCharacterIdByAccountAddress reverted", []);
      return;
    }

    let characterId = game
      .toHex()
      .concat("-character-")
      .concat(characterIdResult.value.toHex());

    let entity = Character.load(characterId);

    if (entity == null) {
      log.error("TransferSingle: character not found", []);
      return;
    }

    let experience = entity.experience;
    experience = experience.minus(event.params.value);
    entity.experience = experience;

    entity.save();

    let gameEntity = Game.load(game.toHex());
    if (gameEntity == null) {
      log.error("TransferSingle: game not found", []);
      return;
    }

    let totalExperience = gameEntity.experience;
    totalExperience = totalExperience.minus(event.params.value);
    gameEntity.experience = totalExperience;

    gameEntity.save();
    return;
  }

  if (
    event.params.from !=
    Address.fromHexString("0x0000000000000000000000000000000000000000")
  ) {
    log.warning("TransferSingle: from is not zero address", []);
    return;
  }

  let characterIdResult = gameContract.try_getCharacterIdByAccountAddress(
    event.params.to
  );

  if (characterIdResult.reverted) {
    log.error("TransferSingle: getCharacterIdByAccountAddress reverted", []);
    return;
  }

  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(characterIdResult.value.toHex());

  let entity = Character.load(characterId);

  if (entity == null) {
    log.error("TransferSingle: character not found", []);
    return;
  }

  let experience = entity.experience;
  experience = experience.plus(event.params.value);
  entity.experience = experience;

  entity.save();

  let gameEntity = Game.load(game.toHex());
  if (gameEntity == null) {
    log.error("TransferSingle: game not found", []);
    return;
  }

  let totalExperience = gameEntity.experience;
  totalExperience = totalExperience.plus(event.params.value);
  gameEntity.experience = totalExperience;

  gameEntity.save();
}
