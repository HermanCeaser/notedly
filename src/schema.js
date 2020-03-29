//import GraphQL 
const { gql } = require('apollo-server-express')

//Construct a schema of GraphQL
module.exports = gql `
	scalar DateTime
	type Note {
		id: ID!
		content: String!
		author: String!
		createdAt: DateTime!
		updatedAt: DateTime!

	}

	type User {
		id: ID!
		username: String!
		email: String!
		avatar: String!
		notes: [Note!]!
	}

	type Query {
		hello: String
		notes: [Note!]!
		note(id: ID!): Note!
	}

	type Mutation {
		newNote(content: String!, author: String): Note!
		updateNote(id: ID!, content: String!): Note!
		deleteNote(id: ID!): Boolean!
		signUp(username: String!, password: String!, email: String!): String!
		signIn(username: String, password: String!, email: String): String!
	}
`
