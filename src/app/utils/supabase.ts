import { Grant, GrantDAO } from '@/app/types/grants';

const DEFAULT_DESCRIPTION = 'No description found';

const toGrant = (grantDAOs: GrantDAO[]): Grant[] => {
  return grantDAOs.map((grant) => {
    const toGrant: Grant = {
      deadline_date: grant.deadline_date, // DeadlineType,
      industries_served: grant.industries_served,
      name: grant.name,
      organization_name: grant.organization_name,
      url: grant.url,
      amount: grant.amount ?? null,
      date_added: grant.date_added,
      description: grant.description ?? DEFAULT_DESCRIPTION,
    };
    return toGrant;
  });
};

export { toGrant };
