import { expect, test } from "vitest";
import { Submission } from "../src/submission";
import { Grant } from "../src/types/grants";
// A test suite for the submission module

const testGrant01: Grant = {
  amount: "varies",
  approved: "no",
  date_added: "2024-02-16T17:58:58.906Z",
  deadline_date: "2024-02-25T17:29:40.868Z",
  deadline_type: "fixed",
  id: "d2907610-8ee6-4ef6-bb50-c33864d5a0ec",
  industries_served: "non-profit",
  last_updated: "2024-02-16T17:58:58.906Z",
  name: "todd-test-03",
  organization_name: "todd-org",
  source: "user",
  url: "https://www.twitch.tv",
  year_uuid: "2024-d2907610-8ee6-4ef6-bb50-c33864d5a0ec",
};

const testSparseGrant01 = {
  amount: "varies",
  deadline_date: "UNDEFINED_DATE",
  deadline_type: "varying",
  industries_served: "non-profit",
  name: "todd-test-12",
  organization_name: "todd-org",
  url: "https://www.twitch.tv",
};

test("create a submission", async () => {
  const result = await Submission.create(testGrant01, false);
  expect(result).toEqual(testGrant01.id);
});

test("list submissions", async () => {});

test("get a submission", async () => {});

test("update a submission", async () => {});

test("remove a submission", async () => {});
