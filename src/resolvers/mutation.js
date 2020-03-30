const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError} = require('apollo-server-express')
require('dotenv').config()
const mongoose = require('mongoose')

//Local Imports
const gravatar = require('../util/gravatar')


module.exports = {
	newNote: async (parent, args, { models, user }) => {
		//If there is no user in the context, then throw an Authentication error
		if(!user) {
			throw new AuthenticationError('you must be signed in to create a note')
		}

		return await models.Note.create({
			content: args.content,
			//Reference Author's Mongo id
			author: mongoose.Types.ObjectId(user.id)
		})
	},
	deleteNote: async (parent, { id }, { models, user } ) => {
		//If not user, throw an Auth Error
		if(!user) {
			throw new AuthenticationError('You must be signed in to delete a Note')
		}
		//find the note
		const note = await models.Note.findById(id)

		//if note and current user don't match, throw an error
		if( note && String(note.author) !== user.id) {
			throw new ForbiddenError('You don\'t have permission to Delete this Note')

		}
		//If everything is ok
		try {
			await note.remove()
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
		//If not user, throw an Auth Error
		if(!user) {
			throw new AuthenticationError('You must be signed in to delete a Note')
		}
		//find the note
		const note = await models.Note.findById(id)

		//if note and current user don't match, throw an error
		if( note && String(note.author) !== user.id) {
			throw new ForbiddenError('You don\'t have permission to Delete this Note')

		}
		//If everything is fine
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
	},
	toggleFavorite: async(parent, { id }, { models, user }) => {
		//if no user context is passed, throw auth error
		if(!user) {
			throw new AuthenticationError('You must be signed in to favorite a note')
		}

		//check to see if user has already favorited the note
		let noteCheck = await models.Note.findById(id)
		const hasUser = noteCheck.favoriteBy.indexOf(user.id)

		//if user exists in that list
		//pull them out and decrement the count by one
		if(hasUser >= 0) {
			return await models.Note.findByIdAndUpdate(
				id,
				{
					$pull: {
						favoriteBy: mongoose.Types.ObjectId(user.id)
					},
					$inc: {
						favoriteCount: -1
					}
				},
				{
					//Set new to true and return the updated doc
					new: true
				}
			)
		} else {
			//if user doesn't exist in this list,
			//add them to the list and increment the favcount by 1
			return await models.Note.findByIdAndUpdate(
				id,
				{
					$push: {
						favoriteBy: mongoose.Types.ObjectId(user.id)
					},
					$inc: {
						favoriteCount: +1
					}
				},
				{
					new: true
				}
				
			)
		}
	}


}