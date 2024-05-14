import { generateRandomIdentity } from "@hadronous/pic";
import { resolve } from "path";
import { IDL } from "@dfinity/candid";
import { estateDaoFixture, initTestSuite } from "../utils/pocket-ic";
import { estateDaoNftInit } from "../utils/canister";

describe("estate_dao_nft Upgrade Check", () => {
  const suite = initTestSuite();
  let token: estateDaoFixture;
  const controllerAccount = generateRandomIdentity();

  beforeAll(async () => {
    await suite.setup();

    token = await suite.deployEstateDaoNftCanister({
      name: "Test Token",
      symbol: "TEST"
    }, {
      sender: controllerAccount.getPrincipal(),
      controllers: [controllerAccount.getPrincipal()],
    });

    token.actor.setIdentity(controllerAccount);
  })

  afterAll(suite.teardown);

  describe("upgrade success", () => {
    it("initial config", async () => {
      const name = await token.actor.icrc7_name();
      expect(name).toBe("Test Token");

      const symbol = await token.actor.icrc7_symbol();
      expect(symbol).toBe("TEST");
    });

    it("upgrade", async () => {
      const instance = await suite.getInstance();
      await instance.tick(10);

      await instance.upgradeCanister({
        sender: controllerAccount.getPrincipal(), 
        canisterId: token.canisterId,
        wasm: resolve('.azle', 'estate_dao_nft', 'estate_dao_nft.wasm.gz'),
        arg: IDL.encode(estateDaoNftInit({ IDL }), [{ Upgrade: null }]),
      });

      const name = await token.actor.icrc7_name();
      expect(name).toBe("Test Token");

      const symbol = await token.actor.icrc7_symbol();
      expect(symbol).toBe("TEST");
    });
  });
});