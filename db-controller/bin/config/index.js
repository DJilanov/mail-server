module.exports = {
	api: {
		port: process.env.PORT || 13700,
	},
	database: {
		dbAddress: process.env.MONGO_URL || 'mongodb+srv://mongo-admin-reader:5zDzVHOKfAHSPa85@cluster0.wt5ll.mongodb.net/instagram'
	}
};