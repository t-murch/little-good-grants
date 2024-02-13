import { Table } from "sst/node/table";
import dynamoDb from "./dynamodb";
import { Grant, SparseGrant, hydrateGrant } from "./types/grants";

export async function create(sparseGrant: SparseGrant) {
  const fullGrant = hydrateGrant(sparseGrant);

  const params = {
    TableName: Table.Grants.tableName,
    Item: fullGrant,
  };

  await dynamoDb.put(params);

  return "Success";
}

// Reteive all submissions that have
// a future deadline_date
export async function list(): Promise<Grant[]> {
  const params = {
    TableName: Table.Grants.tableName,
    FilterExpression: "deadline_date > :now",
    ExpressionAttributeValues: {
      ":now": new Date().toISOString(),
    },
  };

  const data = await dynamoDb.query(params);
  if (!data.Items) return [];

  return data.Items.map((item) => item as Grant);
}

// Get a single grant by id
export async function get(
  id: string,
): Promise<
  { data: Grant; success: true } | { error: "Grant not found"; success: false }
> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { id },
  };

  const data = await dynamoDb.get(params);
  if (!data.Item) return { error: "Grant not found", success: false };

  return { data: data.Item as Grant, success: true };
}

// Update all grant values by id
export async function update(id: string, grant: Grant): Promise<"Success"> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { id },
    UpdateExpression:
      "set #amount = :amount, #deadline_date = :deadline_date, #description = :description, #industries_served = :industries_served, #name = :name, #organization_name = :organization_name, #url = :url",
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
export async function deleteGrant(id: string): Promise<"Success"> {
  const params = {
    TableName: Table.Grants.tableName,
    Key: { id },
  };
  await dynamoDb.delete(params);

  return "Success";
}

export * as Submission from "./submission";
