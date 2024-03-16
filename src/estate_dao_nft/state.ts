import { InitArgs, MetadataStoreType } from "./types";

export const MetadataStore: MetadataStoreType = {
  symbol: "",
  name: "",
  total_supply: 0n,
};

export function init_collection(args: InitArgs) {
  MetadataStore.symbol = args.symbol;
  MetadataStore.name = args.name;
  MetadataStore.description = args.description.Some;
  MetadataStore.logo = args.logo.Some;
}
