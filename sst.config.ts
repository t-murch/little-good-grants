import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(_input) {
    return {
      name: "little-good-grants",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(FrontendStack);
  },
} satisfies SSTConfig;
