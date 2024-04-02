import { Principal } from "@dfinity/principal";
import { provisionActor, initProvisionCanister } from "../utils/pocket-ic";
import { generateRandomIdentity } from "@hadronous/pic";
import { isErrResult, isNone, isOkResult, isSome } from "../utils/common";

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

      expect(isErrResult(addPropertyResult)).toBe(true);
      if (!isErrResult(addPropertyResult)) return;

      expect(addPropertyResult.Err).toBe("Anonymous users not allowed");

      const pendingRequestIds = await actor.get_pending_requests();
      expect(pendingRequestIds).toHaveLength(0);

      actor.setIdentity(alice);
    });

    it("success - adds request", async () => {
      const addPropertyResult = await actor.add_property_request(testPropertyMetadata);

      expect(isOkResult(addPropertyResult)).toBe(true);
      if (!isOkResult(addPropertyResult)) return;

      expect(addPropertyResult.Ok).toBeGreaterThanOrEqual(0);
      const id = addPropertyResult.Ok;

      const pendingRequestIds = await actor.get_pending_requests();
      expect(pendingRequestIds).toEqual([id]);

      const metadata = await actor.get_request_metadata(id);
      expect(metadata).toEqual([testPropertyMetadata]);
    });
  });

  describe("get_request_metadata", () => {
    it("returns None on non-existent request id", async () => {
      const metadata = await actor.get_request_metadata(999n);
      expect(isNone(metadata)).toBe(true);
    });
  });
});
