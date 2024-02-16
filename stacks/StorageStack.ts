import { StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const table = new Table(stack, "Grants", {
    fields: {
      amount: "string",
      approved: "string",
      date_added: "string",
      deadline_date: "string",
      id: "string",
      description: "string",
      industries_served: "string",
      last_updated: "string",
      name: "string",
      organization_name: "string",
      source: "string",
      submitted: "string",
      url: "string",
      year_uuid: "string",
    },

    primaryIndex: { partitionKey: "year_uuid" },
    globalIndexes: {
      approvedDeadlineIndex: {
        partitionKey: "approved",
        sortKey: "deadline_date",
      },
    },
  });

  return {
    table,
  };
}
