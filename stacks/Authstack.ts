import { API } from "./ApiStack";
import { Cognito, StackContext, use } from "sst/constructs";

export function AuthStack({ stack, app }: StackContext) {
  const { api } = use(API);

  // Create a Cognito User Pool and Identity Pool
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    api,
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    UserPoolClientId: auth.userPoolClientId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
  });

  // Return the auth resource
  return {
    auth,
  };
}
