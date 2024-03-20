import {
  Record,
  Principal,
  Opt,
  Variant,
  text,
  nat,
  Vec,
  Tuple,
  bool,
} from "azle";
import { Value } from "./common";

export const InitArg = Record({
  symbol: text,
  name: text,
  description: Opt(text),
  logo: Opt(text),
  property_owner: Principal,
});

export type InitArg = typeof InitArg.tsType;


export const MetadataResult = Vec(Tuple(text, Value));
export type MetadataResult = typeof MetadataResult.tsType;

export const UpdateMetadataArg = Record({
  symbol: Opt(text),
  name: Opt(text),
  description: Opt(text),
  logo: Opt(text),
});
export type UpdateMetadataArg = typeof UpdateMetadataArg.tsType;

export const TxnResult = Variant({
  Ok: nat,
  Err: text,
});
export type TxnResult = typeof TxnResult.tsType;

export type MetadataStoreType = {
  symbol: text;
  name: text;
  description?: text;
  logo?: text;
  total_supply: nat;
  supply_cap?: nat;

  max_query_batch_size?: nat;
  max_update_batch_size?: nat;
  default_take_value?: nat;
  max_take_value?: nat;
  max_memo_size?: nat;
  atomic_batch_transfers?: bool;
  tx_window?: nat;
  permitted_drift?: nat;

  property_owner: text;
};

type UnwritableMetadataKeys =
  | "max_query_batch_size"
  | "max_update_batch_size"
  | "default_take_value"
  | "max_take_value"
  | "max_memo_size"
  | "atomic_batch_transfers"
  | "tx_window"
  | "permitted_drift"
  | "total_supply";
export type WritableMetadataType = Partial<Omit<MetadataStoreType, UnwritableMetadataKeys>>;
