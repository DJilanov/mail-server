const mongoose = require('mongoose');

module.exports = mongoose.model(
	'Bot', 
	{
		_id: { 
			type: mongoose.Types.ObjectId, 
			auto: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		username: {
			type: String,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		proxy: {
			type: String,
			required: true
		},
		dateOfCreation: {
			type: Number,
			required: true
		},
		followingIds: [{
			type: String,
			required: true
		}],
		instaImagesIds: [{
			type: String,
			required: true
		}],
	}
);