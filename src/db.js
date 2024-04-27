const mongoose = require('mongoose')

module.exports = {
	connect: DB_HOST => {
		mongoose.set('useNewUrlParser', true)
		mongoose.set('useFindAndModify', false)
		mongoose.set('useCreateIndex', true)
		mongoose.set('useUnifiedTopology', true)

		//connect to the DB
		mongoose.connect(DB_HOST)
		console.log('Connected To DB successfully!!');
		//log an error if we fail to connect
		mongoose.connection.on('error', err => {
			console.log(err)
			console.log('MongoDB connection error. Please make sure MongoDB is running.')
			process.exit()
		})
	},
	close: () => {
		mongoose.connection.close()
	}
}