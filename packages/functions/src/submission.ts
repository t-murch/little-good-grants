import { Submission } from "@little-good-grants/core/submission";
import handler from "@little-good-grants/core/handler";
import { Grant, SparseGrant } from "@little-good-grants/core/types/grants";

// create a submission
export const create = handler(async (event) => {
  if (event.body === null) {
    throw new Error("No body found");
  }

  const parseResult = SparseGrant.safeParse(JSON.parse(event.body));
  if (!parseResult.success) {
    throw new Error("Invalid body");
  }

  return await Submission.create(parseResult.data);
});

// Retreive all unapproved grants with future deadlines
// or varying and ongoing deadlines
export const list = handler(async (_event) => {
  return JSON.stringify(await Submission.listFutureDefined());
});

// Get a single submission by id
export const get = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }
  console.log("id", id);

  const result = await Submission.get(id);
  if (!result.success) {
    throw new Error(result.error);
  }

  return JSON.stringify(result.data);
});

// update a submission by id
export const update = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }
  if (event.body === null) {
    throw new Error("No body found");
  }

  const result = await Submission.get(id);
  if (!result.success) {
    throw new Error(result.error);
  }

  const parsedUserGrant = Grant.partial().safeParse(JSON.parse(event.body));
  if (!parsedUserGrant.success) {
    throw new Error("Invalid body");
  }

  await Submission.update(id, parsedUserGrant.data as Partial<Grant>);

  return "Submission updated";
});

// delete a submission by id
export const remove = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }

  await Submission.remove(id);

  return "Deleted submission with id: " + id;
});
