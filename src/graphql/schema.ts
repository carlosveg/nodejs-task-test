import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Task {
    id: String!
    title: String!
    description: String
    columnId: String!
  }

  type Column {
    id: String!
    name: String!
    position: Int!
    isDefault: Boolean!
    tasks: [Task!]!
  }

  type Query {
    columns(userId: String!): [Column!]!
    tasks(userId: String!): [Task!]!
  }
`
