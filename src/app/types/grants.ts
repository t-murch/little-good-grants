export type Grant = {
  Name: string;
  OrganizationName: string;
  DeadlineDueDate: DeadlineType;
  URL: string;
  Amount: number;
  Description: string;
  PopulationServed: string;
  IndustriesServed: string;
  DateAdded: string;
  LastUpdated: string;
  submitted: boolean;
  SubmissionDate: string;
  approved: boolean;
};

type Status = "varying" | "ongoing";

type CustomDateFormat = `${string}-${string}-${string}`;

type DeadlineType = Status | CustomDateFormat;
