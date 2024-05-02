import { provisionActor, initTestSuite } from "../utils/pocket-ic";
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
  let actor: provisionActor;
  const suite = initTestSuite();
  const admin = generateRandomIdentity();
  
  const draftPropertyCount = 3;
  const publishedPropertyCount = 2;
  const totalPropertyCount = draftPropertyCount + publishedPropertyCount;
  
  let draftProperties: Vec<nat> = [];
  let publishedProperties: Vec<nat> = [];

  async function seed() {
    const properties = await Promise.all(
      new Array(totalPropertyCount)
      .fill(undefined)
      .map(async () => {
        const res = await actor.add_property_request(testPropertyMetadata);
        expectResultIsOk(res);

        return res.Ok;
      })
    );
    
    await Promise.all(
      properties
        .slice(0, publishedPropertyCount)
        .map(id => actor.approve_request(id))
    );

    publishedProperties = properties.slice(0, publishedPropertyCount);
    draftProperties = properties.slice(publishedPropertyCount);
  }

  beforeAll(async () => {
    await suite.setup();
    const provision = await suite.deployProvisionCanister();
    const assetProxy = await suite.deployAssetProxyCanister();
    const tempAsset = await suite.deployAssetCanister();

    const managementActor = await suite.attachToManagementCanister();

    await configureCanisters({
      provision,
      assetProxy,
      tempAsset,
      management: {
        canisterId: Principal.from("aaaaa-aa"),
        actor: managementActor
      }
    }, admin.getPrincipal())

    actor = provision.actor;
    actor.setIdentity(admin);

    await seed();
  });

  afterAll(suite.teardown);

  describe("list_properties", () => {
    it("status: Draft", async () => {
      const listedProperties = await actor.list_properties([{ Draft: null }]);
      expect(listedProperties.sort()).toEqual(draftProperties.sort());
    });

    it("status: Published", async () => {
      const listedProperties = await actor.list_properties([{ Published: null }]);
      expect(listedProperties.sort()).toEqual(publishedProperties.sort());
    });

    it("status: Default", async () => {
      const listedProperties = await actor.list_properties([]);
      expect(listedProperties.sort()).toEqual(publishedProperties.sort());
    });
  });
});
