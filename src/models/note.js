//Require the mongoose library
const mongoose =  require('mongoose')

//define the note's database schema
const noteSchema =  new mongoose.Schema(
	{
		content: {
			type: String,
			required: true
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		favoriteCount: {
			type: Number,
			default: 0
		},
		favoriteBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		]
	},
	//Assigns CreatedAt and UpdatedAt fields with a date type
	{
		timestamps: true
	}
)
//define the note model with schema
const Note = mongoose.model('Note', noteSchema)

//export the module
module.exports = Note
