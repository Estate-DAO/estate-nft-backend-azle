import { bool, text } from "azle";

export class AdminStore {
  private _admins: Map<text, bool>;

  constructor() {
    this._admins = new Map();
  }

  get admins() {
    return this._admins;
  }

  addAdmin(principal: text) {
    this._admins.set(principal, true);
  }

  removeAdmin(principal: text) {
    this._admins.delete(principal);
  }
}