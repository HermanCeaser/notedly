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
			type: String,
			required: true
		}
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
