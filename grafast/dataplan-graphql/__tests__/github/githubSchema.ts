/* eslint-disable graphile-export/export-methods, graphile-export/export-plans */
import { lambda, makeGrafastSchema, object } from "grafast";

export const githubSchema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    scalar URI
    scalar DateTime
    type Query {
      user(login: String): User
    }
    type PageInfo {
      endCursor: String
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: String
    }
    input IssueOrder {
      direction: OrderDirection!
      field: IssueOrderField!
    }
    enum IssueOrderField {
      COMMENTS
      CREATED_AT
      UPDATED_AT
    }
    enum RepositoryPrivacy {
      PRIVATE
      PUBLIC
    }
    enum RepositoryAffiliation {
      COLLABORATOR
      ORGANIZATION_MEMBER
      OWNER
    }
    input RepositoryOrder {
      direction: OrderDirection!
      field: RepositoryOrderField!
    }
    enum RepositoryVisibility {
      INTERNAL
      PRIVATE
      PUBLIC
    }
    input IssueFilters {
      assignee: String
      createdBy: String
      labels: [String!]
      mentioned: String
      milestone: String
      milestoneNumber: String
      since: DateTime
      states: [IssueState!]
      type: String
      viewerSubscribed: Boolean = false
    }
    enum IssueState {
      CLOSED
      OPEN
    }
    enum OrderDirection {
      ASC
      DESC
    }
    enum RepositoryOrderField {
      CREATED_AT
      NAME
      PUSHED_AT
      STARGAZERS
      UPDATED_AT
    }
    type User implements RepositoryOwner {
      login: String!
      name: String
      repositories(
        affiliations: [RepositoryAffiliation]
        after: String
        before: String
        first: Int
        hasIssuesEnabled: Boolean
        isArchived: Boolean
        isFork: Boolean
        isLocked: Boolean
        last: Int
        orderBy: RepositoryOrder
        ownerAffiliations: [RepositoryAffiliation] = [OWNER, COLLABORATOR]
        privacy: RepositoryPrivacy
        visibility: RepositoryVisibility
      ): RepositoryConnection!
      avatarUrl(size: Int): URI!
      id: ID!
      repository(followRenames: Boolean = true, name: String!): Repository
      resourcePath: URI!
      url: URI!
    }
    type RepositoryConnection {
      edges: [RepositoryEdge]
      nodes: [Repository]
      pageInfo: PageInfo!
      totalCount: Int!
      totalDiskUsage: Int!
    }
    type RepositoryEdge {
      cursor: String!
      node: Repository
    }
    type Repository {
      owner: RepositoryOwner!
      issues(
        after: String
        before: String
        filterBy: IssueFilters
        first: Int
        labels: [String!]
        last: Int
        orderBy: IssueOrder
        states: [IssueState!]
      ): IssueConnection!
    }
    type IssueConnection {
      edges: [IssueEdge]
      nodes: [Issue]
      pageInfo: PageInfo!
      totalCount: Int!
    }
    type IssueEdge {
      cursor: String!
      node: Issue
    }
    type Issue {
      id: ID!
    }
    interface RepositoryOwner {
      avatarUrl(size: Int): URI!
      id: ID!
      login: String!
      repositories(
        affiliations: [RepositoryAffiliation]
        after: String
        before: String
        first: Int
        hasIssuesEnabled: Boolean
        isArchived: Boolean
        isFork: Boolean
        isLocked: Boolean
        last: Int
        orderBy: RepositoryOrder
        ownerAffiliations: [RepositoryAffiliation] = [OWNER, COLLABORATOR]
        privacy: RepositoryPrivacy
        visibility: RepositoryVisibility
      ): RepositoryConnection!
      repository(followRenames: Boolean = true, name: String!): Repository
      resourcePath: URI!
      url: URI!
    }
  `,
  objects: {
    Query: {
      plans: {
        user(_, { $login }) {
          return object({ login: $login });
        },
      },
    },
    User: {
      plans: {
        name($user) {
          return lambda($user, (user) => (user as any)?.login.toUpperCase());
        },
      },
    },
  },
});
