import { Address, BigInt } from "@graphprotocol/graph-ts";
import { TransferSingle as TransferSingleEvent } from "../generated/templates/HatsProtocol/HatsProtocol";
import {
  GameAdmin,
  GameMaster,
  GameOwner,
  Hat,
  HatsData,
} from "../generated/schema";

export function handleTransferSingle(event: TransferSingleEvent): void {
  let from = event.params.from;
  let to = event.params.to;
  let tokenId = event.params.id;
  let amount = event.params.amount;

  if (
    from != Address.fromHexString("0x0000000000000000000000000000000000000000")
  ) {
    return;
  }

  if (amount != BigInt.fromI32(1)) {
    return;
  }

  let hat = Hat.load(tokenId.toString());

  if (hat == null) {
    return;
  }

  let hatType = hat.hatType;

  if (hatType == "OWNER") {
    newOwner(to, hat);
  } else if (hatType == "ADMIN") {
    newAdmin(to, hat);
  } else if (hatType == "GAME_MASTER") {
    newMaster(to, hat);
  }
  // ignoring PLAYER & CHARACTER hats
}

function newOwner(address: Address, hat: Hat): void {
  let hatsData = HatsData.load(hat.hatsData);

  if (hatsData == null) {
    return;
  }

  let gameOwner = new GameOwner(hatsData.id + "-owner-" + address.toHex());

  gameOwner.game = hatsData.game;
  gameOwner.hatsData = hatsData.id;
  gameOwner.hat = hatsData.ownerHat;
  gameOwner.address = address;

  gameOwner.save();
}

function newAdmin(address: Address, hat: Hat): void {
  let hatsData = HatsData.load(hat.hatsData);

  if (hatsData == null) {
    return;
  }

  let gameAdmin = new GameAdmin(hatsData.id + "-admin-" + address.toHex());

  gameAdmin.game = hatsData.game;
  gameAdmin.hatsData = hatsData.id;
  gameAdmin.hat = hatsData.adminHat;
  gameAdmin.address = address;

  gameAdmin.save();
}

function newMaster(address: Address, hat: Hat): void {
  let hatsData = HatsData.load(hat.hatsData);

  if (hatsData == null) {
    return;
  }

  let gameMaster = new GameMaster(hatsData.id + "-master-" + address.toHex());

  gameMaster.game = hatsData.game;
  gameMaster.hatsData = hatsData.id;
  gameMaster.hat = hatsData.gameMasterHat;
  gameMaster.address = address;

  gameMaster.save();
}
