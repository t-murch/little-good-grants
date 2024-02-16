import { NextjsSite, StackContext, use } from "sst/constructs";
import { API } from "./ApiStack";

export function FrontendStack({ stack }: StackContext) {
  const { api } = use(API);
  const site = new NextjsSite(stack, "NextjsSite", {
    environment: {
      NEXT_PUBLIC_API_ENDPOINT: api.url,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
