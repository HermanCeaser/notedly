//import GraphQL 
const { gql } = require('apollo-server-express')

//Construct a schema of GraphQL
module.exports = gql `
	scalar DateTime
	type Note {
		id: ID!
		content: String!
		author: User!
		createdAt: DateTime!
		updatedAt: DateTime!
		favoriteCount: Int!
		favoriteBy: [User!]

	}

	type User {
		id: ID!
		username: String!
		email: String!
		avatar: String!
		notes: [Note!]!
		favorites: [Note!]!
	}

	type Query {
		notes: [Note!]!
		note(id: ID!): Note!
		user(username: String!): User
		users: [User!]!
		me: User!
	}

	type Mutation {
		newNote(content: String!, author: String): Note!
		updateNote(id: ID!, content: String!): Note!
		deleteNote(id: ID!): Boolean!
		signUp(username: String!, password: String!, email: String!): String!
		signIn(username: String, password: String!, email: String): String!
		toggleFavorite(id: ID!): Note!
	}
`
