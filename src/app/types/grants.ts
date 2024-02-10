import { testData } from '@/app/ui/testing/grantlist';

type BaseGrant = {
  // approved: boolean;
  deadline_date: string; // DeadlineType;
  industries_served: string;
  name: string;
  organization_name: string;
  url: string;
};

type Grant = {
  amount: number | string | null;
  approved?: boolean;
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

const parseAmount = (
  amount: string | number | null,
): number | string | null => {
  if (amount === null) return amount;
  if (typeof amount === 'string' && amount.startsWith('$')) {
    return Math.trunc(Number(amount.slice(1).split(',').join('')));
  } else if (typeof amount === 'string') return amount;
  return amount;
};
export const grantDAOtoGrant = (grantDAOs: GrantDAO[]) => {
  return grantDAOs.map((grantDAO) => {
    // const parsedAmount = typeof grantDAO.amount === 'string' && gran
    const myGrant: Grant = {
      amount: parseAmount(grantDAO.amount),
      approved: false,
      date_added: grantDAO.date_added,
      deadline_date: grantDAO.deadline_date,
      description: grantDAO.description ?? undefined,
      industries_served: grantDAO.industries_served,
      name: grantDAO.name,
      organization_name: grantDAO.organization_name,
      submitted: false,
      submission_date: '',
      url: grantDAO.url,
    };
    return myGrant;
  });
};

type Status = 'varying' | 'ongoing';

type CustomDateFormat = `${string}-${string}-${string}`;

type DeadlineType = Status | CustomDateFormat;

export type { BaseGrant, Grant, GrantDAO };

export async function getTableData(): Promise<Grant[]> {
  return new Promise((resolve) =>
    setTimeout(() => {
      return resolve(testData);
    }, 1500),
  );
}
