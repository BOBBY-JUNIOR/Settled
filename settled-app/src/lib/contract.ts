import { type Address, isAddress, zeroAddress } from "viem";
import { billSplitterAbi } from "./abi";

export const BILL_SPLITTER_ABI = billSplitterAbi;

const rawAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export const CONTRACT_ADDRESS = (
  rawAddress && isAddress(rawAddress) ? rawAddress : zeroAddress
) as Address;

export function isContractConfigured(): boolean {
  return CONTRACT_ADDRESS !== zeroAddress;
}

export function explorerTxUrl(hash: string): string {
  const base =
    process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://testnet.monadvision.com";
  return `${base.replace(/\/$/, "")}/tx/${hash}`;
}

export function explorerAddressUrl(address: string): string {
  const base =
    process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://testnet.monadvision.com";
  return `${base.replace(/\/$/, "")}/address/${address}`;
}
