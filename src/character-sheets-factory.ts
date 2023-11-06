import {
  Address,
  BigInt,
  Bytes,
  ByteArray,
  dataSource,
  ethereum,
} from "@graphprotocol/graph-ts";
import {
  NewGameStarted as NewGameStartedEvent,
  Initialized as InitializedEvent,
  CharacterSheetsFactory,
} from "../generated/CharacterSheetsFactory/CharacterSheetsFactory";
import { HatsAdaptor } from "../generated/CharacterSheetsFactory/HatsAdaptor";
import { ImplementationAddressStorage } from "../generated/CharacterSheetsFactory/ImplementationAddressStorage";
import { IClonesAddressStorage } from "../generated/CharacterSheetsFactory/IClonesAddressStorage";
import {
  Game,
  GameAdmin,
  GameMaster,
  GameOwner,
  Global,
  Hat,
  HatsData,
} from "../generated/schema";
import {
  CharacterSheetsImplementation as CharacterSheetsTemplate,
  ClassesImplementation as ClassesTemplate,
  ItemsImplementation as ItemsTemplate,
  ExperienceImplementation as ExperienceTemplate,
  HatsProtocol as HatsProtocolTemplate,
} from "../generated/templates";

import { CharacterSheetsImplementation as CharacterSheetsContract } from "../generated/templates/CharacterSheetsImplementation/CharacterSheetsImplementation";

// Adapted from https://ethereum.stackexchange.com/questions/114582/the-graph-nodes-cant-decode-abi-encoded-data-containing-arrays
// Wrap arguments with this function if (and only if) one of the arguments is an array.
export function tuplePrefixBytes(input: Bytes): Bytes {
  let inputTypedArray = input.subarray(0);

  let tuplePrefix = ByteArray.fromHexString(
    "0x0000000000000000000000000000000000000000000000000000000000000020"
  );

  let inputAsTuple = new Uint8Array(
    tuplePrefix.length + inputTypedArray.length
  );

  inputAsTuple.set(tuplePrefix, 0);
  inputAsTuple.set(inputTypedArray, tuplePrefix.length);

  return Bytes.fromUint8Array(inputAsTuple);
}

export function handleNewGameStarted(event: NewGameStartedEvent): void {
  let clonesStorageAddress = event.params.clonesAddressStorage;

  let clonesStorage = IClonesAddressStorage.bind(clonesStorageAddress);

  let gameAddress = clonesStorage.try_characterSheets();

  if (gameAddress.reverted) {
    return;
  }

  let classesAddress = clonesStorage.classes();
  let itemsAddress = clonesStorage.items();
  let experienceAddress = clonesStorage.experience();
  let hatsAdaptorAddress = clonesStorage.hatsAdaptor();

  let entity = new Game(gameAddress.value.toHex());

  entity.classesAddress = classesAddress;
  entity.itemsAddress = itemsAddress;
  entity.experienceAddress = experienceAddress;
  entity.characterEligibilityAdaptor =
    clonesStorage.characterEligibilityAdaptor();
  entity.classLevelAdaptor = clonesStorage.classLevelAdaptor();
  entity.hatsAdaptor = hatsAdaptorAddress;
  entity.itemsManager = clonesStorage.itemsManager();

  entity.startedBy = event.params.starter;
  entity.startedAt = event.block.timestamp;
  entity.uri = "";
  entity.experience = BigInt.fromI32(0);
  entity.save();

  CharacterSheetsTemplate.create(gameAddress.value);
  ClassesTemplate.create(classesAddress);
  ItemsTemplate.create(itemsAddress);
  ExperienceTemplate.create(experienceAddress);

  let contract = CharacterSheetsContract.bind(gameAddress.value);
  let uriResult = contract.try_metadataURI();
  if (!uriResult.reverted) {
    entity.uri = uriResult.value;
  }

  let hatsData = setupHatsData(gameAddress.value, hatsAdaptorAddress);

  setupGameMasters(
    hatsData,
    event.params.starter,
    event.params.encodedHatsAddresses
  );

  entity.save();
}

function setupHatsData(
  gameAddress: Address,
  hatsAdaptorAddress: Address
): HatsData {
  let hatsDataId = gameAddress.toHex() + "-hats";
  let gameId = gameAddress.toHex();

  let hatsData = new HatsData(hatsDataId);

  hatsData.hatsAdaptor = hatsAdaptorAddress;
  hatsData.game = gameAddress.toHex();

  let hatsAdaptor = HatsAdaptor.bind(hatsAdaptorAddress);
  let data = hatsAdaptor.getHatsData();

  hatsData.ownerHat = newHat(hatsDataId, gameId, data.topHatId, "OWNER");
  hatsData.adminHat = newHat(hatsDataId, gameId, data.adminHatId, "ADMIN");
  hatsData.gameMasterHat = newHat(
    hatsDataId,
    gameId,
    data.gameMasterHatId,
    "GAME_MASTER"
  );
  hatsData.playerHat = newHat(hatsDataId, gameId, data.playerHatId, "PLAYER");
  hatsData.characterHat = newHat(
    hatsDataId,
    gameId,
    data.characterHatId,
    "CHARACTER"
  );

  hatsData.save();

  return hatsData;
}

export function hatIdToHex(hatId: BigInt): string {
  return "0x" + hatId.toHexString().slice(2).padStart(64, "0");
}

export function hatIdToPrettyIdHex(hatId: BigInt): string {
  let hexId = hatIdToHex(hatId);
  let prettyId = hexId.substring(0, 10);
  for (let i = 10; i < hexId.length; i += 4) {
    let domainAtLevel = hexId.substring(i, i + 4);
    if (domainAtLevel == "0000") {
      break;
    }
    prettyId += "." + domainAtLevel;
  }
  return prettyId;
}

export function hatIdToPrettyId(hatId: BigInt): string {
  let hexId = hatIdToHex(hatId);
  let prettyIdHex = hexId.substring(0, 10);
  let prettyId = U64.parseInt(prettyIdHex, 16).toString();
  for (let i = 10; i < hexId.length; i += 4) {
    let domainAtLevel = hexId.substring(i, i + 4);
    if (domainAtLevel == "0000") {
      break;
    }
    let domainAtLevelHex = "0x" + domainAtLevel;
    prettyId += "." + U64.parseInt(domainAtLevelHex, 16).toString();
  }
  return prettyId;
}

function newHat(
  hatsDataId: string,
  gameId: string,
  hatId: BigInt,
  hatType: string
): string {
  let id = hatId.toString();

  let hat = new Hat(id);

  hat.hatsData = hatsDataId;
  hat.game = gameId;
  hat.hatId = hatId.toString();
  hat.hatIdHex = hatIdToHex(hatId);
  hat.prettyIdHex = hatIdToPrettyIdHex(hatId);
  hat.prettyId = hatIdToPrettyId(hatId);
  hat.hatType = hatType;

  hat.save();

  return id;
}

function setupGameMasters(
  hatsData: HatsData,
  ownerAddress: Address,
  encodedHatsAddresses: Bytes
): void {
  let ownerId = hatsData.id + "-owner-" + ownerAddress.toHex();

  let gameOwner = new GameOwner(ownerId);

  gameOwner.game = hatsData.game;
  gameOwner.hatsData = hatsData.id;
  gameOwner.hat = hatsData.ownerHat;
  gameOwner.address = ownerAddress;

  gameOwner.save();

  let decoded = ethereum.decode(
    "(address[],address[],address,address)",
    tuplePrefixBytes(encodedHatsAddresses)
  );

  if (decoded == null) {
    return;
  }

  let decodedTuple = decoded.toTuple();

  let admins = decodedTuple[0].toAddressArray();

  for (let i = 0; i < admins.length; i++) {
    let adminId = hatsData.id + "-admin-" + admins[i].toHex();

    let gameAdmin = new GameAdmin(adminId);

    gameAdmin.game = hatsData.game;
    gameAdmin.hatsData = hatsData.id;
    gameAdmin.hat = hatsData.adminHat;
    gameAdmin.address = admins[i];

    gameAdmin.save();
  }

  let masters = decodedTuple[1].toAddressArray();

  for (let i = 0; i < masters.length; i++) {
    let masterId = hatsData.id + "-master-" + masters[i].toHex();

    let gameMaster = new GameMaster(masterId);

    gameMaster.game = hatsData.game;
    gameMaster.hatsData = hatsData.id;
    gameMaster.hat = hatsData.gameMasterHat;
    gameMaster.address = masters[i];

    gameMaster.save();
  }
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Global(dataSource.network().toString());
  entity.gameFactory = event.address;

  let gameFactory = CharacterSheetsFactory.bind(event.address);

  let implementationAddress = gameFactory.implementations();

  let implementationsStorage = ImplementationAddressStorage.bind(
    implementationAddress
  );

  let hatsContractAddress = implementationsStorage.hatsContract();

  HatsProtocolTemplate.create(hatsContractAddress);

  entity.save();
}
