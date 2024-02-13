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

  await Submission.create(parseResult.data);

  return "Submission created";
});

// Retreive all submissions
export const list = handler(async (_event) => {
  return JSON.stringify(await Submission.list());
});

// Get a single submission by id
export const get = handler(async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    throw new Error("No id found");
  }

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

  const parsedUserGrant = Grant.safeParse(JSON.parse(event.body));
  if (!parsedUserGrant.success) {
    throw new Error("Invalid body");
  }

  const updatedGrant = {
    ...result.data,
    ...parsedUserGrant.data,
  };

  await Submission.update(id, updatedGrant);

  return "Submission updated";
});
