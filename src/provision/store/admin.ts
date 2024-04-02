import { Principal, bool, text } from "azle";

export class AdminStore {
  private _admins: Map<text, bool>;

  constructor() {
    this._admins = new Map();
  }

  get admins() {
    return this._admins;
  }

  addAdmin(principal: Principal) {
    this._admins.set(principal.toString(), true);
  }

  removeAdmin(principal: Principal) {
    this._admins.delete(principal.toString());
  }
}
