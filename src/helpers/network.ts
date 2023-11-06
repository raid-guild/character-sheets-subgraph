import { dataSource, BigInt } from "@graphprotocol/graph-ts";

export function getChainId(): BigInt {
  const network = dataSource.network();
  if (network == "mainnet") return BigInt.fromI32(1);
  else if (network == "goerli") return BigInt.fromI32(5);
  else if (network == "gnosis") return BigInt.fromI32(100);
  else return BigInt.fromI32(0);
  // else if (network == 'matic') return '0x89';
  // else if (network == 'mumbai') return '0x13881';
  // else if (network == 'arbitrum-one') return '0xa4b1';
  // else if (network == 'arbitrum-goerli') return '0x66eed';
  // else if (network == 'optimism') return '0xa';
  // else if (network == 'optimism-kovan') return '0x45';
  // else if (network == 'aurora') return '0x4e454152';
  // else if (network == 'aurora-testnet') return '0x4e454153';
  // else return 'unknown';
}
