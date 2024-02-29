import { GrantService } from "@little-good-grants/core/grant";
import handler from "@little-good-grants/core/handler";
import { FormGrant, Grant } from "@little-good-grants/core/types/grants";

// handle zod parse errors
const handleZodErrors = (errors: any[]) => {
  return errors.map((e) => JSON.stringify(e) || "Invalid Issue").join(", ");
};

export const createSubmission = handler(async (event) => {
  let parseMe: FormGrant;
  if (event.body === null) {
    throw new Error("No body found");
  }

  try {
    parseMe = await JSON.parse(event.body);
  } catch (error) {
    console.error("Error parsing JSON", error);
    throw new Error(
      `Error parsing JSON: ${String(error)}` || "Error parsing JSON",
    );
  }
  const parseResult = FormGrant.safeParse(parseMe);
  if (!parseResult.success) {
    console.error("typeof parseMe: ", typeof parseMe);
    console.error("parseMe: ", parseMe);
    console.error(`Zod Parsing Error: ${parseResult.error})`);
    throw new Error(
      parseResult.error.issues
        ?.map((i) => JSON.stringify(i) || "Invalid Issue")
        .join(", ") || "Invalid Body",
    );
  }

  return await GrantService.create(parseResult.data, false);
});

export const listings = handler(async (_event) => {
  return JSON.stringify(await GrantService.listFutureDefined(true));
});

export const list = handler(async (event) => {
  const approved = event.pathParameters?.approved === "true";
  return JSON.stringify(await GrantService.listFutureDefined(approved));
});

export const get = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }

  const result = await GrantService.get(id);
  if (!result.success) {
    throw new Error(result.error);
  }

  return JSON.stringify(result.data);
});

// update a grant by id
export const update = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }
  if (event.body === null) {
    throw new Error("No body found");
  }
  const data = JSON.parse(event.body || "{}");

  console.log("\n data=", data, "\n");
  const parsedUserGrant = Grant.partial().safeParse(data?.grant);
  if (!parsedUserGrant.success) {
    throw new Error("Invalid body");
  }
  console.log("\n parsedUserGrant=", parsedUserGrant, "\n");

  const response = await GrantService.update(
    id,
    parsedUserGrant.data as Partial<Grant>,
  );
  console.log("\n response=", response, "\n");

  return JSON.stringify(getStatus(true, `Updated submission with id: ${id}`));
});

// delete a submission by id
export const remove = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }

  await GrantService.remove(id);

  return JSON.stringify(getStatus(true, `Deleted submission with id: ${id}`));
});

function getStatus(success: boolean, message: string) {
  return { success, message };
}
