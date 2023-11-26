import { Grant } from "../home/granttable";

const testData: Grant[] = [
  {
    Name: "Grant 1",
    OrganizationName: "Organization A",
    DeadlineDueDate: "2023-12-01",
    URL: "https://example.com/grant1",
    Amount: 5000,
    Description: "Description for Grant 1",
    PopulationServed: "Community A",
    IndustriesServed: "Industry X",
    DateAdded: "2023-11-01T08:00:00Z",
    LastUpdated: "2023-11-05T10:30:00Z",
    submitted: true,
    SubmissionDate: "2023-11-03T15:45:00Z",
    approved: true,
  },
  {
    Name: "Grant 2",
    OrganizationName: "Organization B",
    DeadlineDueDate: "2023-11-15",
    URL: "https://example.com/grant2",
    Amount: 8000,
    Description: "Description for Grant 2",
    PopulationServed: "Community B",
    IndustriesServed: "Industry Y",
    DateAdded: "2023-10-15T12:30:00Z",
    LastUpdated: "2023-10-20T09:45:00Z",
    submitted: true,
    SubmissionDate: "2023-10-18T17:20:00Z",
    approved: false,
  },
];
