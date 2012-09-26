var Cloud = require('ti.cloud'),
	moment = require('moment');
	
//Cache all session data at the module level for every launch,
//but force a refresh after a certain amount of time TODO
var sessions = [];

function Session() {}

//Get a complete session listing (this will never top 100)
Session.getAll = function(callback) {
	//hit cache first
	if (sessions.length > 0) {
		//return a simulated event immediately
		callback({
			success:true,
			sessions:sessions
		});
	}
	else {
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
			
			try {
				callback(e);
			} catch (ex) {
				alert(ex);
			}
		});
	}
};

//TODO: Do an actual query for the next event, based on actual time.
Session.getNext = function(cb) {
	Cloud.Objects.query({
		classname:'Session',
		page:1,
		per_page:1
	}, function(e) {
		//on the fail case, e will contain ACS error info
		var next;
		if (e.success) {
			next = e.Session[0];
		}
		cb({
			next:next,
			success:e.success	
		});
	});
};

//Return all sessions for a given day - if before conference, show day 1, if after, show day 3
Session.getForDay = function(dateString, cb) {
	
};

module.exports = Session;
