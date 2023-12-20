type BaseGrant = {
  // approved: boolean;
  deadline_date: string; // DeadlineType;
  industries_served: string;
  name: string;
  organization_name: string;
  url: string;
};

type Grant = {
  amount: number | 'Unknown';
  date_added: string;
  description?: string;
  submitted?: boolean;
  submission_date?: string;
} & BaseGrant;

interface GrantDAO {
  amount: number | null;
  // approved: boolean;
  date_added: string;
  deadline_date: string;
  description: string | null;
  id: number;
  industries_served: string;
  last_updated: string | null;
  name: string;
  organization_name: string;
  submitted: boolean;
  url: string;
}

type Status = 'varying' | 'ongoing';

type CustomDateFormat = `${string}-${string}-${string}`;

type DeadlineType = Status | CustomDateFormat;

export type { BaseGrant, Grant, GrantDAO };
