const mongoose =  require('mongoose')

//define the users's database schema
const userSchema =  new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			index: { unique: true }
		},
		email: {
			type: String,
			required: true,
			index: { unique: true }
		},
		password: {
			type: String,
			required: true
		},
		avatar: {
			type: String
		}
	},
	{
		timestamps: true
	}
)

//define the user model with schema
const User = mongoose.model('User', userSchema)

//export the module
module.exports = User