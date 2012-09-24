var Cloud = require('ti.cloud'),
	User = require('User'),
	moment = require('moment');
	
function Status() {}

/*
 * Create a status update
 * 
 * args = {
 * 	twitter:false,
 *  facebook:false,
 *  message: 'This conference is #sohot',
 *  photo: someBlob
 * }
 */
Status.create = function(args, cb) {	
	var avatar = User.generateAvatarURL(),
		user = User.getUserDetails();
		
	Cloud.Statuses.create({
		message:args.message,
		photo:args.photo,
		custom_fields: {
			avatar:avatar,
			name:user.attributes.firstname+' '+user.attributes.lastname,
			org:user.attributes.organization
		}
	}, function(e) {
		if (e.success) {
			e.status = e.statuses[0];
		}
		else {
			Ti.API.error(e);
		}
		cb(e);
	});
};

//Get a complete session listing (this will never top 100)
Status.getAll = function(cb) {
	Cloud.Statuses.query({
		limit:50,
		response_json_depth:8,
		order:'-created_at'
	}, function(e) {
		cb(e);
	});
};

module.exports = Status;
