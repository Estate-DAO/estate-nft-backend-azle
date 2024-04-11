import { None, Some } from "azle";

export type Some<T> = ReturnType<typeof Some<T>>;
export type None = typeof None;
