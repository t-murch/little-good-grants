export type Grant = {
  name: string;
  organizationName: string;
  deadline: DeadlineType;
  url: string;
  amount: number;
  description: string;
  industryServed: string;
  dateAdded: string;
  lastUpdated: string;
  submitted: boolean;
  submissionDate: string;
  approved: boolean;
};

type Status = "varying" | "ongoing";

type CustomDateFormat = `${string}-${string}-${string}`;

type DeadlineType = Status | CustomDateFormat;
