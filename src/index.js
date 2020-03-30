// index.js
// This is the main entry point of our application
const express = require('express')
const { ApolloServer} = require('apollo-server-express')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const helmet = require('helmet') //For Securing our HTTP headers against common web vulnerabilities
const cors = require('cors') //Cross Origin Resource Sharing
const depthLimit = require('graphql-depth-limit')
const { createComplexityLimitRule } = require('graphql-validation-complexity')

//Local Imports
const db = require('./db')
const models = require('./models')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')



//Run the server on port specified in the Env file or on port 4000
const port = process.env.PORT || 4000 
//Store DB_HOST value as a variable
const DB_HOST = process.env.DB_HOST 


//create an Express app
const app = express()
//Apply Helmet Middleware for security
app.use(helmet())
//Apply Cross Origin Resource sharing middleware
app.use(cors())

//Connect to the database
db.connect(DB_HOST);

//function to get the user token
const getUser =  token => {
	if(token) {
		try {
			//return user info from token
			return jwt.verify(token, process.env.JWT_SECRET)
		} catch(err){
			//Throw an error if the token has a problem
			throw new Error('Session Invalid')
		}
	}
}

//Apollo server setup
const server = new ApolloServer({ 
	typeDefs, 
	resolvers,
	validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
	context: ({ req }) => {
		//get the token from request headers
		const token = req.headers.authorization
		//try to retrieve a user with a token
		const user = getUser(token)
		console.log(user)
		//Add Models to the context
		return { models, user }
	} 
})

//Apply Apollo graphQL middleware and set the path to /api
server.applyMiddleware({ app, path:'/api' })

app.listen({ port }, () => 
	console.log(
		`GraphQL Server running at http://localhost:${ port }${ server.graphqlPath }`
	)
)
