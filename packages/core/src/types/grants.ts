import { z } from "zod";
import { v4 as uuid } from "uuid";

const UNDEFINED_DATE = "UNDEFINED_DATE";
const DeadlineDate = ["varying", "ongoing", "fixed"] as const;
type DeadlineDate = (typeof DeadlineDate)[number];
// type DeadlineDate = "varying" | "ongoing" | "fixed";

const FormGrant = z.object({
  amount: z.union([z.number(), z.literal("varied")]).optional(),
  deadline_date: z.string().datetime(),
  industries_served: z.union([z.literal("non-profit"), z.literal("profit")]),
  name: z.string(),
  organization_name: z.string(),
  url: z.string().url(),
});

type FormGrant = z.infer<typeof FormGrant>;

const SparseGrant = z.object({
  amount: z.union([z.number(), z.literal("varied")]),
  deadline_date: z.union([z.string().datetime(), z.literal(UNDEFINED_DATE)]),
  deadline_type: z.union([
    z.literal("varying"),
    z.literal("ongoing"),
    z.literal("fixed"),
  ]),
  description: z.string().optional(),
  industries_served: z.string(),
  name: z.string(),
  organization_name: z.string(),
  url: z.string().url(),
});

type SparseGrant = z.infer<typeof SparseGrant>;

const Grant = z.object({
  ...SparseGrant.shape,
  approved: z.union([z.literal("yes"), z.literal("no")]),
  date_added: z.string().datetime(),
  id: z.string().uuid(),
  last_updated: z.string(),
  source: z.union([z.literal("user"), z.literal("scrape")]),
  submitted: z.literal("x").optional(),
  submission_date: z.string().optional(),
  year_uuid: z.string(),
});

type Grant = z.infer<typeof Grant>;

function parseAmount(amount: string | number | null): number | "varied" {
  if (amount === null) return "varied";
  if (typeof amount === "string" && amount.startsWith("$")) {
    return Math.trunc(Number(amount.slice(1).split(",").join("")));
  } else if (typeof amount === "string") return "varied";
  return amount;
}

function parseDeadlineDate(date: string): DeadlineDate {
  if (DeadlineDate.includes(date as DeadlineDate)) return date as DeadlineDate;
  return date === UNDEFINED_DATE ? "ongoing" : "fixed";
}

function generatePartitionKey(uuid: string): string {
  if (!z.string().uuid().safeParse(uuid).success) {
    throw new Error("Invalid UUID");
  }

  const today = new Date();
  const year = today.getFullYear().toString();

  return `${year}-${uuid}`;
}

// Map 1x1 SparseGrant to Grant
function hydrateGrant(
  thirstyGrant: FormGrant | SparseGrant,
  source: "user" | "scrape" = "user",
): Grant {
  const id = uuid();
  const currentTime = new Date().toISOString();

  return Object.assign(thirstyGrant, {
    amount: parseAmount(thirstyGrant?.amount || null),
    approved: "no",
    date_added: currentTime,
    deadline_type: parseDeadlineDate(
      thirstyGrant?.deadline_date || UNDEFINED_DATE,
    ),
    id: id,
    last_updated: currentTime,
    source: source,
    year_uuid: generatePartitionKey(id),
  }) as Grant;
}

export {
  generatePartitionKey,
  FormGrant,
  Grant,
  hydrateGrant,
  parseAmount,
  parseDeadlineDate,
  SparseGrant,
};
export type {
  FormGrant as FormGrantType,
  Grant as GrantType,
  SparseGrant as SparseGrantType,
};
