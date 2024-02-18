import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";
import { StorageStack } from "./stacks/StorageStack";
import { API } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/Authstack";

export default {
  config(_input) {
    return {
      name: "little-good-grants",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(API).stack(AuthStack).stack(FrontendStack);
  },
} satisfies SSTConfig;
