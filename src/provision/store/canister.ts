import { Principal } from "azle";

export class CanisterStore {
  private _id: Principal;

  constructor() {
    this._id = Principal.anonymous();
  }

  get id() {
    return this._id;
  }

  updateId(id: Principal) {
    this._id = id;
  }
}
