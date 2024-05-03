import { Principal } from "azle";
import { Ledger } from "azle/canisters/ledger";

export const TRANSFER_FEE = 10_000n;
export const icpLedger = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));