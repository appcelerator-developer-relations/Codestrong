var Cloud = require('ti.cloud'),
	moment = require('moment');
	
//Cache all session data at the module level for every launch,
//but force a refresh after a certain amount of time TODO
var sessions = [],
	days = {
		sunday: [],
		monday: [],
		tuesday: [],
	},
	monDate = moment('Oct 22, 2012'),
	tueDate = moment('Oct 23, 2012');

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
		Cloud.Events.query({
			per_page:100,
			page:1,
			order:'start_time'
		}, function(e) {
			//on the fail case, e will contain ACS error info
			if (e.success) {
				sessions = e.events;
				e.sessions = sessions;
			}
			callback(e);
		});
	}
};

//TODO: Figure out how to sort of date fields in ACS
Session.getNext = function(cb) {
	Cloud.Events.query({
		page:1,
		per_page:100,
		order:'start_time'
	}, function(e) {
		var next;
		if (e.success) {
			var now = moment();
			for (var i = 0, l = e.events.length; i<l; i++) {
				var s = e.events[i];
				var sessTime = moment(s.start_time);
				if (sessTime.diff(now) >= 0) {
					next = s;
					break;
				}
			}
		}
		cb({
			next:next,
			success:e.success	
		});
	});
};

//Return all sessions for a given day - if before conference, show day 1, if after, show day 3
Session.getForDay = function(dateString, cb) {
	if (days[dateString].length > 0) {
		cb({
			success:true,
			sessions:days[dateString]
		});
		return;
	}
	
	Cloud.Events.query({
		page:1,
		per_page:100,
		order:'start_time'
	}, function(e) {
		if (e.success) {
			var sessions = e.events;
			for (var i = 0, l = sessions.length; i<l; i++) {
				var session = sessions[i],
					sessionStart = moment(session.start_time);
				
				if (sessionStart.diff(monDate) < 0) {
					days.sunday.push(session);
				}
				else if (sessionStart.diff(tueDate) < 0) {
					days.monday.push(session);
				}
				else {
					days.tuesday.push(session);
				}
			}
		}
		
		e.sessions = days[dateString];
		cb(e);
		
	});
};

module.exports = Session;
