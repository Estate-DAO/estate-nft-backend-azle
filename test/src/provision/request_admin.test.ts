import { provisionActor, initProvisionCanister } from "../utils/pocket-ic";
import { generateRandomIdentity } from "@hadronous/pic";
import {
  expectResultIsErr,
  expectResultIsOk,
  isNone,
  isOkResult,
  isSome,
  loadAssetCanisterWasm,
  loadTokenCanisterWasm,
} from "../utils/common";

const testPropertyMetadata = {
  logo: [] as [],
  description: [] as [],
  name: "Test Estate",
  symbol: "TEST",
};

describe("Property Requests", () => {
  let actor: provisionActor;
  const { setup, teardown, attachToTokenCanister } = initProvisionCanister();
  const alice = generateRandomIdentity();
  const bob = generateRandomIdentity();

  async function addSeedRequest() {
    actor.setIdentity(bob);
    const res = await actor.add_property_request(testPropertyMetadata);
    actor.setIdentity(alice);
    return isOkResult(res) ? res.Ok : undefined;
  }

  beforeAll(async () => {
    actor = await setup();

    const tokenWasm = await loadTokenCanisterWasm();
    await actor.set_token_canister_wasm(tokenWasm);

    const assetWasm = await loadAssetCanisterWasm();
    await actor.set_asset_canister_wasm(assetWasm);

    await actor.add_admin(alice.getPrincipal());
    actor.setIdentity(alice);
  });
  afterAll(teardown);

  describe("reject_request", () => {
    let requestId: bigint | undefined;

    beforeAll(async () => {
      requestId = await addSeedRequest();
    });

    it("fails for non-admin", async () => {
      expect(requestId).not.toBeUndefined();
      if (requestId === undefined) return;

      actor.setIdentity(bob);

      const result = await actor.reject_request(requestId);
      expectResultIsErr(result);
      expect(result.Err).toBe("The user does not have admin access.");

      const request = await actor.get_request_info(requestId);
      expect(request).toEqual([
        {
          metadata: [testPropertyMetadata],
          property_owner: bob.getPrincipal(),
          approval_status: { Pending: null },
          token_canister: [],
          asset_canister: [],
        },
      ]);
    });

    it("fails for non-existent id", async () => {
      actor.setIdentity(alice);

      const result = await actor.reject_request(999n);
      expectResultIsErr(result);
      expect(result.Err).toBe("No request exists with the given id.");
    });

    it("success - request rejected", async () => {
      expect(requestId).not.toBeUndefined();
      if (requestId === undefined) return;

      actor.setIdentity(alice);

      const result = await actor.reject_request(requestId);
      expectResultIsOk(result);

      const request = await actor.get_request_info(requestId);
      expect(request).toEqual([
        {
          metadata: [],
          property_owner: bob.getPrincipal(),
          approval_status: { Rejected: null },
          token_canister: [],
          asset_canister: [],
        },
      ]);
    });
  });

  describe("approve_request", () => {
    let requestId: bigint | undefined;

    beforeAll(async () => {
      requestId = await addSeedRequest();
    });

    it("fails for non-admin", async () => {
      expect(requestId).not.toBeUndefined();
      if (requestId === undefined) return;

      actor.setIdentity(bob);

      const result = await actor.approve_request(requestId);
      expectResultIsErr(result);
      expect(result.Err).toBe("The user does not have admin access.");

      const request = await actor.get_request_info(requestId);
      expect(request).toEqual([
        {
          metadata: [testPropertyMetadata],
          property_owner: bob.getPrincipal(),
          approval_status: { Pending: null },
          token_canister: [],
          asset_canister: [],
        },
      ]);
    });

    it("fails for non-existent id", async () => {
      actor.setIdentity(alice);

      const result = await actor.approve_request(999n);
      expectResultIsErr(result);
      expect(result.Err).toBe("No request exists with the given id.");
    });

    it("success - request approved", async () => {
      expect(requestId).not.toBeUndefined();
      if (requestId === undefined) return;

      actor.setIdentity(alice);

      const result = await actor.approve_request(requestId);
      expectResultIsOk(result);

      const request = await actor.get_request_info(requestId);
      expect(request).toMatchObject([
        {
          metadata: [],
          property_owner: bob.getPrincipal(),
          approval_status: { Approved: null },
        },
      ]);
      expect(isSome(request[0]!.token_canister)).toBe(true);
      if (!isSome(request[0]!.token_canister)) return;

      const canisterId = request[0]!.token_canister[0];
      const tokenActor = attachToTokenCanister(canisterId);

      const name = await tokenActor.icrc7_name();
      const symbol = await tokenActor.icrc7_symbol();

      expect(name).toBe(testPropertyMetadata.name);
      expect(symbol).toBe(testPropertyMetadata.symbol);
    });
  });
});
