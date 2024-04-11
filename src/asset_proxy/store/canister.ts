import { Principal } from "azle";

export class CanisterStore {
  private _principal: Principal;

  constructor() {
    this._principal = Principal.anonymous();
  }

  setPrincipal(principal: Principal) {
    this._principal = principal;
  }

  getPrincipal(): Principal {
    return this._principal;
  }
}