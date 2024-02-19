import { NextjsSite, StackContext, use } from "sst/constructs";
import { API } from "./ApiStack";
import { AuthStack } from "./Authstack";

export function FrontendStack({ stack, app }: StackContext) {
  const { api } = use(API);
  const { auth } = use(AuthStack);
  const site = new NextjsSite(stack, "NextjsSite", {
    path: "packages/frontend",
    environment: {
      NEXT_PUBLIC_REGION: app.region,
      NEXT_PUBLIC_API_URL: api.url,
      NEXT_PUBLIC_USER_POOL_ID: auth.userPoolId,
      NEXT_PUBLIC_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      NEXT_PUBLIC_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
