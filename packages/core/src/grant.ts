import {
  AttributeValue,
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
} from "aws-sdk/clients/dynamodb";
import { Table } from "sst/node/table";
import dynamoDb from "./dynamodb";
import { FormGrant, Grant, SparseGrant, hydrateGrant } from "./types/grants";

export async function create(
  incomingGrant: FormGrant | SparseGrant,
  approved: boolean,
) {
  const fullGrant = hydrateGrant(incomingGrant);
  fullGrant.approved = approved ? "yes" : "no";

  const params = {
    TableName: Table.Grants.tableName,
    Item: fullGrant,
  };

  await dynamoDb.put(params);

  return fullGrant.id;
}

// Retrieve all UN-approved grants
// with future or varying deadlines
// unapproved grants = submissions
// approved grants = listings
export async function listFutureDefined(approved: boolean) {
  const params = {
    TableName: Table.Grants.tableName,
    IndexName: "approvedDeadlineIndex",
    KeyConditionExpression:
      "#approved = :approved AND #deadline_date >= :today",
    ExpressionAttributeNames: {
      "#approved": "approved",
      "#deadline_date": "deadline_date",
    },
    ExpressionAttributeValues: {
      ":approved": approved ? "yes" : "no",
      ":today": new Date().toISOString(),
    },
  };

  const data = await dynamoDb.query(params);
  if (!data.Items) return [];

  return data.Items;
}

// Retrieve all UN-approved grants
// with ongoing or varying deadlines
export async function listOngoing(approved: boolean) {
  const params = {
    TableName: Table.Grants.tableName,
    IndexName: "approvedDeadlineIndex",
    KeyConditionExpression:
      "#approved = :approved AND #deadline_date = :undefinedDate",
    FilterExpression: "#deadline_type = :ongoing OR #deadline_type = :varying",
    ExpressionAttributeNames: {
      "#approved": "approved",
      "#deadline_date": "deadline_date",
      "#deadline_type": "deadline_type",
    },
    ExpressionAttributeValues: {
      ":approved": approved ? "yes" : "no",
      ":undefinedDate": "UNDEFINED_DATE",
      ":ongoing": "ongoing",
      ":varying": "varying",
    },
  };

  const data = await dynamoDb.query(params);
  if (!data.Items) return [];

  return data.Items;
}

// Get a single grant by id
export async function get(
  id: string,
): Promise<
  { data: Grant; success: true } | { error: "Grant not found"; success: false }
> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { year_uuid: `${new Date().getFullYear().toString()}-${id}` },
  };

  const data = await dynamoDb.get(params);
  if (!data.Item) return { error: "Grant not found", success: false };

  return { data: data.Item as Grant, success: true };
}

export async function getAnyYearSubmission(
  id: string,
  year: string,
): Promise<
  { data: Grant; success: true } | { error: "Grant not found"; success: false }
> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { year_uuid: `${year}-${id}` },
  };

  const data = await dynamoDb.get(params);
  if (!data.Item) return { error: "Grant not found", success: false };

  return { data: data.Item as Grant, success: true };
}

function generateUpdateExpression(grant: Partial<Grant>) {
  const updateExpression = [];
  const expressionAttributeValues: ExpressionAttributeValueMap = {};
  const expressionAttributeNames: ExpressionAttributeNameMap = {};
  let key: keyof typeof grant;
  for (key in grant) {
    if (grant[key] !== undefined && key !== "id" && key !== "year_uuid") {
      updateExpression.push(`#${key} = :${key}`);
      (expressionAttributeValues[`:${key}`] = grant[key] as AttributeValue),
        (expressionAttributeNames[`#${key}`] = key);
    }
  }
  return {
    UpdateExpression: `set ${updateExpression.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
  };
}

// Update all grant values by id
export async function update(
  id: string,
  grant: Partial<Grant>,
): Promise<{ success: boolean }> {
  grant.last_updated = new Date().toISOString();

  const params = {
    TableName: Table.Grants.tableName,
    Key: { year_uuid: `${new Date().getFullYear().toString()}-${id}` },
    ...generateUpdateExpression(grant),
  };

  await dynamoDb.update(params);

  return { success: true };
}

export async function updateAnyYearSubmission(
  id: string,
  year: string,
  grant: Grant,
): Promise<"Success"> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { year_uuid: `${year}-${id}` },
    UpdateExpression:
      "set poop = :amount, #deadline_date = :deadline_date, #description = :description, #industries_served = :industries_served, #name = :name, #organization_name = :organization_name, #url = :url",
    ExpressionAttributeValues: {
      ":amount": grant.amount,
      ":deadline_date": grant.deadline_date,
      ":description": grant.description,
      ":industries_served": grant.industries_served,
      ":name": grant.name,
      ":organization_name": grant.organization_name,
      ":url": grant.url,
    },
  };

  await dynamoDb.update(params);

  return "Success";
}

// Delete a grant by id
export async function remove(id: string): Promise<"Success"> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { year_uuid: `${new Date().getFullYear().toString()}-${id}` },
  };
  await dynamoDb.delete(params);

  return "Success";
}

export async function deleteAnyYearSubmission(
  id: string,
  year: string,
): Promise<"Success"> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { year_uuid: `${year}-${id}` },
  };

  await dynamoDb.delete(params);

  return "Success";
}

export * as GrantService from "./grant";
