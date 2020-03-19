import { gql } from "apollo-boost";

export const GET_ALL_JOBS_FN = gql`
query getListJobs {
  jobs {
    title,
    createdAt,
    postedAt,
    company {
      name
    },
    countries {
      name
    }
  }
}
`