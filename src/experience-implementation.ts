import { Address, log } from "@graphprotocol/graph-ts";
import { Character, Game } from "../generated/schema";
import { CharacterSheetsImplementation } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";

import {
  ExperienceImplementation,
  Transfer as TransferEvent,
} from "../generated/templates/ExperienceImplementation/ExperienceImplementation";

export function handleTransfer(event: TransferEvent): void {
  if (
    event.params.from !=
    Address.fromHexString("0x0000000000000000000000000000000000000000")
  ) {
    log.warning("TransferSingle: from is not zero address", []);
    return;
  }

  let contract = ExperienceImplementation.bind(event.address);
  let game = contract.characterSheets();

  let gameContract = CharacterSheetsImplementation.bind(game);

  let result = gameContract.try_getCharacterIdByAccountAddress(event.params.to);

  if (result.reverted) {
    log.error("TransferSingle: getCharacterIdByAccountAddress reverted", []);
    return;
  }

  let characterId = game
    .toHex()
    .concat("-character-")
    .concat(result.value.toHex());

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
