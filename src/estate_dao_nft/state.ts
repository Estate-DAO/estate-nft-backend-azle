import { InitArgs, MetadataStorageType } from "./types";

export const Metadata: MetadataStorageType = {
  symbol: "",
  name: "",
  total_supply: 0n,
};

export function init_collection(args: InitArgs) {
  Metadata.symbol = args.symbol;
  Metadata.name = args.name;
  Metadata.description = args.description.Some;
  Metadata.logo = args.logo.Some;
}
