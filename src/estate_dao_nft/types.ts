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
  nat64,
  Null,
  nat32,
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

export const InitArg = Record({
  symbol: text,
  name: text,
  description: Opt(text),
  logo: Opt(text),
  property_owner: Principal,
});

export type InitArg = typeof InitArg.tsType;

export const MintArg = Record({
  subaccount: Opt(Subaccount),
});

export type MintArg = typeof MintArg.tsType;

export const BurnArg = Record({
  token_id: nat,
});

export type BurnArg = typeof BurnArg.tsType;

export const TransferArg = Record({
  from_subaccount: Opt(Subaccount),
  to: Account,
  token_id: nat,
  memo: Opt(blob),
  created_at_time: Opt(nat64),
});

export const TransferError = Variant({
  NonExistingTokenId: Null,
  InvalidRecipient: Null,
  Unauthorized: Null,
  TooOld: Null,
  CreatedInFuture: Record({ ledger_time: nat64 }),
  Duplicate: Record({ duplicate_of: nat }),
  GenericError: Record({ error_code: nat, message: text }),
  GenericBatchError: Record({ error_code: nat, message: text }),
});

export const TransferResult = Variant({
  Ok: nat,
  Err: TransferError,
});

export type TransferArg = typeof TransferArg.tsType;
export type TransferError = typeof TransferError.tsType;
export type TransferResult = typeof TransferResult.tsType;

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

type TokenType = {
  owner: {
    principal: text;
    subaccount?: Subaccount;
  };
};

export type TokenStoreType = Map<nat32, TokenType>;
export type OwnerToTokenIndexType = Map<text, Map<nat32, bool>>;
export type TokenStoreReadonlyType = ReadonlyMap<nat32, TokenType>;
export type OwnerToTokensIndexReadonlyType = ReadonlyMap<text, ReadonlyMap<nat32, bool>>;

export type TxnIndexStoreType = {
  index: nat;
};

export const ICRC61Standards = Vec(
  Record({
    name: text,
    url: text,
  }),
);
export type ICRC61Standards = typeof ICRC61Standards.tsType;
