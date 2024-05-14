import { generateRandomIdentity } from "@hadronous/pic";
import { resolve } from "path";
import { IDL } from "@dfinity/candid";
import { provisionFixture, initTestSuite } from "../utils/pocket-ic";
import { provisionInit } from "../utils/canister";

describe("estate_dao_nft Upgrade Check", () => {
  const suite = initTestSuite();
  let provision: provisionFixture;
  const assetProxyCanisterId = generateRandomIdentity();
  const controllerAccount = generateRandomIdentity();

  beforeAll(async () => {
    await suite.setup();

    provision = await suite.deployProvisionCanister({
      sender: controllerAccount.getPrincipal(),
      controllers: [controllerAccount.getPrincipal()],
    });

    provision.actor.setIdentity(controllerAccount);
  });

  afterAll(suite.teardown);

  describe("upgrade success", () => {
    it("initial config", async () => {
      await provision.actor.set_asset_proxy_canister(assetProxyCanisterId.getPrincipal());
      const storedAssetProxyCanisterId = await provision.actor.get_asset_proxy_canister();
      expect(storedAssetProxyCanisterId.toText()).toBe(
        assetProxyCanisterId.getPrincipal().toText(),
      );
    });

    it("upgrade", async () => {
      const instance = await suite.getInstance();
      await instance.tick(10);

      await instance.upgradeCanister({
        sender: controllerAccount.getPrincipal(),
        canisterId: provision.canisterId,
        wasm: resolve(".azle", "provision", "provision.wasm.gz"),
        arg: IDL.encode(provisionInit({ IDL }), [[{ Upgrade: null }]]),
      });

      const storedAssetProxyCanisterId = await provision.actor.get_asset_proxy_canister();
      expect(storedAssetProxyCanisterId.toText()).toBe(
        assetProxyCanisterId.getPrincipal().toText(),
      );
    });
  });
});
