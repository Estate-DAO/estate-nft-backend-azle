import { generateRandomIdentity } from "@hadronous/pic";
import { resolve } from "path";
import { IDL } from "@dfinity/candid";
import { estateDaoFixture, initTestSuite } from "../utils/pocket-ic";
import { estateDaoNftInit } from "../utils/canister";
import { SamplePropertyInit } from "../utils/sample";
import { deriveSubaccount } from "../../../src/common/token";

const testInitMetadata = {
  ...SamplePropertyInit,
  name: "Test Token",
  symbol: "TEST",
  price: 100_000n,
};

describe("estate_dao_nft Upgrade Check", () => {
  const suite = initTestSuite();
  let token: estateDaoFixture;
  const controllerAccount = generateRandomIdentity();
  const userAccount = generateRandomIdentity();

  beforeAll(async () => {
    await suite.setup();

    const minterAccount = generateRandomIdentity();
    const icpLedger = await suite.deployIcpLedgerCanister(minterAccount.getPrincipal());
    icpLedger.actor.setIdentity(minterAccount);

    testInitMetadata.token = icpLedger.canisterId;

    token = await suite.deployEstateDaoNftCanister(testInitMetadata, {
      sender: controllerAccount.getPrincipal(),
      controllers: [controllerAccount.getPrincipal()],
    });

    token.actor.setIdentity(userAccount);
    const subaccount = deriveSubaccount(userAccount.getPrincipal());

    await icpLedger.actor.icrc1_transfer({
      from_subaccount: [],
      to: {
        owner: token.canisterId,
        subaccount: [subaccount],
      },
      fee: [],
      memo: [],
      created_at_time: [],
      amount: testInitMetadata.price * 2n,
    });

    await token.actor.mint({
      subaccount: [],
      quantity: 1n
    });

    token.actor.setIdentity(controllerAccount);
  });

  afterAll(suite.teardown);

  describe("upgrade success", () => {
    it("initial config", async () => {
      const metadata = await token.actor.get_property_metadata();
      expect(metadata).toMatchObject(testInitMetadata);

      const tokens = await token.actor.icrc7_tokens([], []);
      expect(tokens).toHaveLength(1);

      const userTokens = await token.actor.icrc7_tokens_of(
        {
          owner: userAccount.getPrincipal(),
          subaccount: [],
        },
        [],
        [],
      );
      expect(userTokens).toHaveLength(1);
    });

    it("upgrade", async () => {
      const instance = await suite.getInstance();
      await instance.tick(10);

      await instance.upgradeCanister({
        sender: controllerAccount.getPrincipal(),
        canisterId: token.canisterId,
        wasm: resolve(".azle", "estate_dao_nft", "estate_dao_nft.wasm.gz"),
        arg: IDL.encode(estateDaoNftInit({ IDL }), [{ Upgrade: null }]),
      });

      const metadata = await token.actor.get_property_metadata();
      expect(metadata).toMatchObject(testInitMetadata);

      const tokens = await token.actor.icrc7_tokens([], []);
      expect(tokens).toHaveLength(1);

      const userTokens = await token.actor.icrc7_tokens_of(
        {
          owner: userAccount.getPrincipal(),
          subaccount: [],
        },
        [],
        [],
      );
      expect(userTokens).toHaveLength(1);
    });
  });
});
