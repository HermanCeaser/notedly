const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError} = require('apollo-server-express')
require('dotenv').config()

//Local Imports
const gravatar = require('../util/gravatar')


module.exports = {
	newNote: async (parent, args, { models }) => {
		return await models.Note.create({
			content: args.content,
			author: args.author
		})
	},
	deleteNote: async (parent, { id }, { models } ) => {
		try {
			await models.Note.findOneAndRemove({
				_id: id
			})
			return true
		}
		catch(err){
			return false
		}
	},
	/*
	* findOneAndUpdate(param1, param2, param3) This Method takes 3 parameters; 
	* param1 to find the correct note in the database,
	* param2 to set the new content and
	* param3 to instruct the database to return the updated note content to us
	*/
	updateNote: async (parent, { content, id }, { models }) => {
		return await models.Note.findOneAndUpdate(
		{
			_id: id
		},
		{
			$set: {
				content
			}
		},
		{
			new: true
		}
		)
	},
	signUp: async (parent, { username, email, password }, { models }) => {
		//normalize email address
		email = email.trim().toLowerCase()

		//hash the password
		const hashed  = await bcrypt.hash(password, 10)

		//create gravatar url
		const avatar = gravatar(email)

		try {
			const user = await models.User.create({
				username,
				email,
				avatar,
				password: hashed
			})

			//create and return json webtoken
			return jwt.sign({ id: user._id}, process.env.JWT_SECRET)
		} catch(err){
			console.log(err)
			//If there is a problem creating the account, throw an error
			throw new Error('Error Creating  account, Try Again Later')
		}

	},
	signIn: async (parent, { username, email, password }, { models }) => {
		//normalize email
		if(email){
			email = email.trim().toLowerCase()
		}
		

		const user = await models.User.findOne({
			$or: [{ email }, { username }]
		})

		//If no user is found, Throw an Authentication error
		if(!user) {
			throw new AuthenticationError('Error Signing In!')
		}

		//if passwords don't match, throw an authentication error
		const valid = await bcrypt.compare(password, user.password)
		if(!valid){
			throw new AuthenticationError('Passwords don\'t match')
		}
		//create and return Json Web Token
		return jwt.sign({ id: user._id}, process.env.JWT_SECRET)
	}


}