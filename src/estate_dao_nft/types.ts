import {
  Record,
  Principal,
  Opt,
  blob,
  Variant,
  text,
  nat,
  int,
  Vec,
  Tuple,
  bool,
} from "azle";

export const Subaccount = blob;
export type Subaccount = blob;

export const Account = Record({
  owner: Principal,
  subaccount: Opt(Subaccount),
});
export type Account = typeof Account.tsType;

const PrimitiveValues = {
  Blob: blob,
  Text: text,
  Nat: nat,
  Int: int,
};
export const Value = Variant({
  ...PrimitiveValues,
  Map: Vec(Tuple(text, Variant(PrimitiveValues))),
  Array: Vec(Variant(PrimitiveValues)),
});
export type Value = typeof Value.tsType;

export type ICRC7Metadata = {
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
};
