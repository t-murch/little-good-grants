import { StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  // Create the DynamoDB table
  // const listingsTable = new Table(stack, "Notes", {
  //   fields: {
  //     userId: "string",
  //     noteId: "string",
  //   },
  //   primaryIndex: { partitionKey: "userId", sortKey: "noteId" },
  // });

  /**
   * create table
  public.submissions (
    id integer not null default nextval('listings_id_seq'::regclass),
    name character varying(255) not null,
    organization_name character varying(255) not null,
    deadline_date text not null,
    url character varying(255) not null,
    amount character varying null,
    description text null,
    industries_served character varying(255) not null default ''::character varying,
    date_added timestamp without time zone not null default current_timestamp,
    last_updated timestamp without time zone not null default current_timestamp,
    submitted boolean not null default false,
    approved boolean not null default false,
    source public.Source not null default 'unknown'::"Source",
     constraint submissions_pkey primary key (id)
  ) tablespace pg_default;
  */
  const table = new Table(stack, "Grants", {
    fields: {
      id: "number",
      name: "string",
      organization_name: "string",
      deadline_date: "string",
      url: "string",
      amount: "string", // Nullable field
      description: "string", // Nullable field
      industries_served: "string", // Default value field
      date_added: "string",
      last_updated: "string",
      submitted: "binary",
      approved: "binary",
      source: "string",
    },
    primaryIndex: { partitionKey: "id", sortKey: "approved" },
  });

  return {
    table,
  };
}
