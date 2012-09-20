var Cloud = require('ti.cloud'),
	moment = require('moment');
	
//Cache all session data at the module level for every launch,
//but force a refresh after a certain amount of time TODO
var sessions = [];

function Session() {}

//Get a complete session listing (this will never top 100)
Session.getAll = function(cb) {
	//hit cache first
	if (sessions.length > 0) {
		//return a simulated event immediately
		cb({
			success:true,
			sessions:sessions
		});
	}
	Cloud.Objects.query({
		classname:'Session',
		page:1,
		per_page:100
	}, function(e) {
		//on the fail case, e will contain ACS error info
		if (e.success) {
			sessions = e.Session;
			e.sessions = sessions;
		}
		cb(e);
	});
};

//Loop through the session information and determine the next one
//inefficient, but sufficient for this small data set
Session.getNext = function(cb) {
	
};

//Return all sessions for a given day - if before conference, show day 1, if after, show day 3
Session.getForDay = function(dateString, cb) {
	
};

module.exports = Session;
