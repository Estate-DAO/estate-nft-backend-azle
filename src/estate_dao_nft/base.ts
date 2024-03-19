import { MetadataStore } from "./store";
import { InitArg } from "./types";

export function initImpl(args: InitArg) {
  MetadataStore.update({
    symbol: args.symbol,
    name: args.name,
    description: args.description.Some,
    logo: args.logo.Some,
  });
}
