import { provisionActor, initTestSuite, managementActor } from "../utils/pocket-ic";
import { generateRandomIdentity } from "@hadronous/pic";
import { expectResultIsErr, expectResultIsOk, isSome } from "../utils/common";
import { SamplePropertyRequest } from "../utils/sample";
import { configureCanisters } from "../utils/deploy";
import { Principal } from "@dfinity/principal";
import { Vec, nat } from "azle";

const testPropertyMetadata = {
  ...SamplePropertyRequest,
  name: "Test Estate",
  symbol: "TEST",
};

describe("Property Requests", () => {
  let actor: provisionActor, managementActor: managementActor;
  const suite = initTestSuite();
  const admin = generateRandomIdentity();
  const controller = generateRandomIdentity();

  const draftPropertyCount = 1;
  const publishedPropertyCount = 2;
  const totalPropertyCount = draftPropertyCount + publishedPropertyCount;

  let publishedProperties: {
    id: nat;
    token_canister: Principal;
    asset_canister: Principal;
  }[] = [];

  async function seed() {
    const properties = await Promise.all(
      new Array(totalPropertyCount).fill(undefined).map(async () => {
        const res = await actor.add_property_request(testPropertyMetadata);
        expectResultIsOk(res);

        return res.Ok;
      }),
    );

    await Promise.all(
      properties.slice(0, publishedPropertyCount).map((id) => actor.approve_request(id)),
    );

    publishedProperties = await Promise.all(
      properties.slice(0, publishedPropertyCount).map(async (id) => {
        const property = await actor.get_request_info(id);
        return {
          id,
          token_canister: property[0]?.token_canister[0]!,
          asset_canister: property[0]?.asset_canister[0]!,
        };
      }),
    );
  }

  beforeAll(async () => {
    await suite.setup();
    const provision = await suite.deployProvisionCanister({ sender: controller.getPrincipal() });
    const assetProxy = await suite.deployAssetProxyCanister({ sender: controller.getPrincipal() });
    const tempAsset = await suite.deployAssetCanister({ sender: controller.getPrincipal() });
    managementActor = await suite.attachToManagementCanister();

    provision.actor.setIdentity(controller);
    assetProxy.actor.setIdentity(controller);
    tempAsset.actor.setIdentity(controller);
    managementActor.setIdentity(controller);

    await configureCanisters(
      {
        provision,
        assetProxy,
        tempAsset,
        management: {
          canisterId: Principal.from("aaaaa-aa"),
          actor: managementActor,
        },
      },
      admin.getPrincipal(),
    );

    actor = provision.actor;
    actor.setIdentity(admin);

    await seed();
  });

  afterAll(suite.teardown);

  it("list_properties", async () => {
    const listedProperties = await actor.list_properties();
    expect(listedProperties.sort()).toEqual(publishedProperties.sort());
  });

  describe("delete_property", () => {
    it("fails on non-controller", async () => {
      const account = generateRandomIdentity();
      const property = publishedProperties[0];
      actor.setIdentity(account);

      const result = await actor.delete_property(property.id);
      expectResultIsErr(result);
    });

    it("success", async () => {
      const property = publishedProperties[0];
      actor.setIdentity(controller);

      const result = await actor.delete_property(property.id);
      expectResultIsOk(result);

      const instance = suite.getInstance();
      const assetCanisterSubnet = await instance.getCanisterSubnetId(property.asset_canister);
      const tokenCanisterSubnet = await instance.getCanisterSubnetId(property.token_canister);
      expect(assetCanisterSubnet).toBe(null);
      expect(tokenCanisterSubnet).toBe(null);
    });
  })
});
