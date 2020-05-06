module.exports = {
	notes: async (parent, args, { models }) => {
		return await models.Note.find().limit(100)
	},
	note: async (parent, args, { models }) => {
		return await models.Note.findById(args.id)
	},
	user: async (parent, { username }, { models }) => {
		return await models.User.findOne({ username })
	},
	users: async (parent, args, { models }) => {
		return await models.User.find()
	},
	me: async (parent, args, { models, user }) => {
		return await models.User.findById(user.id)
	},
	noteFeed: async (parent, { cursor }, { models }) => {
		//hard code the limit to 10 items
		const limit = 5
		//set the default hasNextPage to false
		let hasNextPage = false
		//if no cursor is passed, then query is empty
		//this will pull the newest notes from the database
		let cursorQuery = {}

		//if a cursor is passed,
		//our query will look for notes with an object id less than that of a cursor
		if(cursor) {
			cursorQuery = {_id: 
				{ $lt: cursor }
			}
		}

		//find the limit + 1  of notes in our db, sorted newest to oldest
		let notes = await models.Note.find(cursorQuery)
		.sort({_id: -1})
		.limit(limit + 1)

		//if the number of notes found exceed our limit,
		//set hasNextPage to true and trim the notes to the limit
		if(notes.length > limit) {
			hasNextPage = true
			notes = notes.slice(0, -1)
		}

		//the new cursor will be the mongo object id of the last item
		const newCursor = notes[notes.length - 1]._id

		return {
			notes,
			cursor: newCursor,
			hasNextPage
		}
	}



}