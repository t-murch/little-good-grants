import { z } from "zod";
import { v4 as uuid } from "uuid";

const SparseGrant = z.object({
  amount: z.union([z.number(), z.literal("varies")]),
  date_added: z.string().datetime(),
  deadline_date: z.union([
    z.string().datetime(),
    z.literal("varying"),
    z.literal("ongoing"),
  ]), // DeadlineType;
  description: z.string().optional(),
  industries_served: z.string(),
  name: z.string(),
  organization_name: z.string(),
  url: z.string(),
});

type SparseGrant = z.infer<typeof SparseGrant>;

const Grant = z.object({
  ...SparseGrant.shape,
  approved: z.boolean(),
  id: z.string().uuid(),
  last_updated: z.string(),
  source: z.union([z.literal("user"), z.literal("scrape")]),
  submitted: z.boolean(),
  submission_date: z.string().optional(),
});

type Grant = z.infer<typeof Grant>;

const parseAmount = (amount: string | number | null) => {
  if (amount === null) return "varies";
  if (typeof amount === "string" && amount.startsWith("$")) {
    return Math.trunc(Number(amount.slice(1).split(",").join("")));
  } else if (typeof amount === "string") return "varies";
  return amount;
};

// Map 1x1 SparseGrant to Grant
function hydrateGrant(
  sparseGrant: SparseGrant,
  source: "user" | "scrape" = "user",
): Grant {
  return {
    ...sparseGrant,
    approved: false,
    id: uuid(),
    last_updated: new Date().toISOString(),
    source: source,
    submitted: false,
  };
}

export { Grant, hydrateGrant, parseAmount, SparseGrant };
export type { Grant as GrantType, SparseGrant as SparseGrantType };
