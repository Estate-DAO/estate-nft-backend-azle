import { generateRandomIdentity } from "@hadronous/pic";
import {
  Ok,
  expectResultIsErr,
  expectResultIsOk,
  isErrResult,
  isOkResult,
  loadAssetCanisterWasm,
  loadTokenCanisterWasm,
} from "../utils/common";
import { provisionActor, initProvisionCanister } from "../utils/pocket-ic";

describe("Provision Canister", () => {
  let actor: provisionActor;
  const { setup, teardown } = initProvisionCanister();
  let tokenCanisterWasm: Uint8Array, assetCanisterWasm: Uint8Array;
  const alice = generateRandomIdentity();
  const bob = generateRandomIdentity();

  beforeAll(async () => {
    actor = await setup({ sender: alice.getPrincipal() });
    tokenCanisterWasm = await loadTokenCanisterWasm();
    assetCanisterWasm = await loadAssetCanisterWasm();
  });
  afterAll(teardown);

  describe("set_token_canister_wasm", () => {
    it("fails for non-controllers", async () => {
      actor.setIdentity(bob);

      const result = await actor.set_token_canister_wasm(tokenCanisterWasm);
      expectResultIsErr(result);
      expect(result.Err).toBe("Only controllers are allowed");
    });

    it("success - updates wasm", async () => {
      actor.setIdentity(alice);

      const result = await actor.set_token_canister_wasm(tokenCanisterWasm);
      expectResultIsOk(result);
    });
  });

  describe("set_asset_canister_wasm", () => {
    it("fails for non-controllers", async () => {
      actor.setIdentity(bob);

      const result = await actor.set_asset_canister_wasm(assetCanisterWasm);
      expectResultIsErr(result);
      expect(result.Err).toBe("Only controllers are allowed");
    });

    it("success - updates wasm", async () => {
      actor.setIdentity(alice);

      const result = await actor.set_asset_canister_wasm(assetCanisterWasm);
      expectResultIsOk(result);
    });
  });
});
