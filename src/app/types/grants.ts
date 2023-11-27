export type Grant = {
  name: string;
  orgName: string;
  deadline: DeadlineType;
  url: string;
  amount: number;
  description: string;
  popServed: string;
  indServed: string;
  dateAdded: string;
  lastUpdated: string;
  submitted: boolean;
  submissionDate: string;
  approved: boolean;
};

type Status = "varying" | "ongoing";

type CustomDateFormat = `${string}-${string}-${string}`;

type DeadlineType = Status | CustomDateFormat;
