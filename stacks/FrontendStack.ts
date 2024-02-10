import { NextjsSite, StackContext } from "sst/constructs";

export function FrontendStack({ stack, app }: StackContext) {
  const site = new NextjsSite(stack, "NextjsSite", {});

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
