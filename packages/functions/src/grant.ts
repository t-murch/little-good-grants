import handler from "@little-good-grants/core/handler";
import { GrantService } from "@little-good-grants/core/grant";
import { Grant, SparseGrant } from "@little-good-grants/core/types/grants";

export const createSubmission = handler(async (event) => {
  if (event.body === null) {
    throw new Error("No body found");
  }

  const parseResult = SparseGrant.safeParse(JSON.parse(event.body));
  if (!parseResult.success) {
    throw new Error("Invalid body");
  }

  return await GrantService.create(parseResult.data, false);
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

  const result = await GrantService.get(id);
  if (!result.success) {
    throw new Error(result.error);
  }

  const parsedUserGrant = Grant.partial().safeParse(JSON.parse(event.body));
  if (!parsedUserGrant.success) {
    throw new Error("Invalid body");
  }

  await GrantService.update(id, parsedUserGrant.data as Partial<Grant>);

  return "Updated submission with id: " + id;
});

// delete a submission by id
export const remove = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }

  await GrantService.remove(id);

  return "Deleted submission with id: " + id;
});
