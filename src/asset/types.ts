import { Opt, Record, Vec, blob, nat, text } from "azle";

export const StoreArgs = Record({
  key: text,
  content_type: text,
  content_encoding: text,
  content: blob,
  sha256: Opt(blob),
});
export type StoreArgs = typeof StoreArgs.tsType;

export const DeleteArgs = Record({
  key: text,
})
export type DeleteArgs = typeof DeleteArgs.tsType;

export const GetArgs = Record({
  key: text,
  accept_encodings: Vec(text),
});
export type GetArgs = typeof GetArgs.tsType;

export const GetRes = Record({
  key: text,
  content_type: text,
  content_encoding: text,
  content: blob,
  sha256: Opt(blob),
  total_length: nat,
});
export type GetRes = typeof GetRes.tsType;