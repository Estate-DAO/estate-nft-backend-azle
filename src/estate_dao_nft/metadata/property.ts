import { Principal, ic } from "azle";
import { MetadataStore, TxnIndexStore } from "../store";
import { TxnResult, UpdateMetadataArg } from "../types";

export function isCallerPropertyOwner(): boolean {
  return ic.caller().toString() === MetadataStore.store.property_owner;
}

export function update_property_owner(property_owner: Principal): TxnResult {
  if ( !isCallerPropertyOwner() ) return { Err: "Unauthorized" };

  MetadataStore.update({
    property_owner: property_owner.toString()
  });

  return { Ok: TxnIndexStore.store.index };
}

export function update_metadata(args: UpdateMetadataArg): TxnResult {
  if ( !isCallerPropertyOwner() ) return { Err: "Unauthorized" };

  MetadataStore.update({
    symbol: args.symbol.Some,
    name: args.name.Some,
    description: args.description.Some,
    logo: args.logo.Some,
  });

  return { Ok: TxnIndexStore.store.index };
}