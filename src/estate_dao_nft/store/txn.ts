import { nat } from "azle";

export class TxnIndexStore {
  private _index: nat = 0n;

  get index() {
    return this._index;
  }

  increment() {
    this._index++;
  }
}
