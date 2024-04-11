import { Principal } from "@dfinity/principal";
import { provisionActor, initProvisionCanister } from "../utils/pocket-ic";
import { generateRandomIdentity } from "@hadronous/pic";
import { expectResultIsErr, expectResultIsOk, isNone, isSome } from "../utils/common";

const testPropertyMetadata = {
  logo: [] as [],
  description: [] as [],
  name: "Test Estate",
  symbol: "TEST",
};

describe("Property Requests", () => {
  let actor: provisionActor;
  const { setup, teardown } = initProvisionCanister();
  const alice = generateRandomIdentity();

  beforeAll(async () => (actor = await setup()));
  afterAll(teardown);

  describe("add_property_request", () => {
    it("fails on anonymous user", async () => {
      actor.setPrincipal(Principal.anonymous());

      const addPropertyResult = await actor.add_property_request(testPropertyMetadata);
      expectResultIsErr(addPropertyResult);
      expect(addPropertyResult.Err).toBe("Anonymous users not allowed");

      const pendingRequestIds = await actor.get_pending_requests();
      expect(pendingRequestIds).toHaveLength(0);

      actor.setIdentity(alice);
    });

    it("success - adds request", async () => {
      const addPropertyResult = await actor.add_property_request(testPropertyMetadata);
      expectResultIsOk(addPropertyResult);
      expect(addPropertyResult.Ok).toBeGreaterThanOrEqual(0);
      const id = addPropertyResult.Ok;

      const pendingRequestIds = await actor.get_pending_requests();
      expect(pendingRequestIds).toEqual([id]);

      const request = await actor.get_request_info(id);
      expect(request).toEqual([
        {
          metadata: [testPropertyMetadata],
          property_owner: alice.getPrincipal(),
          approval_status: { Pending: null },
          token_canister: [],
          asset_canister: [],
        },
      ]);
    });
  });

  describe("get_request_info", () => {
    it("returns None on non-existent request id", async () => {
      const request = await actor.get_request_info(999n);
      expect(isNone(request)).toBe(true);
    });
  });
});
