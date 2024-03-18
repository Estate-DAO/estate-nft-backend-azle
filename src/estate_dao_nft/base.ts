import { ic } from "azle";
import { _incrementTxnIndex, _updateCollectionMetadata } from "./state";
import { InitArg } from "./types";

export function inspectMessageImpl() {
  _incrementTxnIndex();
  ic.acceptMessage();
}

export function initImpl(args: InitArg) {
  _updateCollectionMetadata({
    symbol: args.symbol,
    name: args.name,
    description: args.description.Some,
    logo: args.logo.Some,
  });
}
