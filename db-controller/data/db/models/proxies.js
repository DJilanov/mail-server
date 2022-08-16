const mongoose = require('mongoose');

module.exports = mongoose.model(
	'Proxy', 
	{
		_id: { 
			type: mongoose.Types.ObjectId, 
			auto: true
		},
		isSocket: {
			type: Boolean,
			required: true
		},
		isHttp: {
			type: Boolean,
			required: true
		},
		ip: {
			type: String,
			required: true
		},
		isActive: {
			type: Boolean,
			required: true
		},
		isWorking: {
			type: Boolean,
			required: true
		},
		shouldBeTested: {
			type: Boolean,
			required: true
		},
		lastCheck: {
			type: Number,
			required: true
		},
		timesTried: {
			type: Number,
			required: true
		},
		timesSucceed: {
			type: Number,
			required: true
		},
		timesFailed: {
			type: Number,
			required: true
		},
		instagramUsers: {
			type: Number,
			required: true
		}
	}
);