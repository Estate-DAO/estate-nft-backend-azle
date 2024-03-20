import {
  Record,
  Opt,
  blob,
  Variant,
  text,
  nat,
  bool,
  nat64,
  Null,
  nat32,
} from "azle";
import { Account, Subaccount } from "./common";

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