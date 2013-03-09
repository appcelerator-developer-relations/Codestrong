var ui = require('ui'),
	moment = require('moment'),
	Status = require('Status'),
	Session = require('Session');
	
$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

function loadContent() {
	//Grab current agenda item
	Session.getNext(function(e) {
		if (e.success) {
			var session = e.next;
			$.title.text = session.name;
			$.presenter.text = session.custom_fields.presenter;
			$.location.text = session.custom_fields.location;
			
			if ($.dailySchedule) {
				var now = moment(),
					monDate = moment('Oct 22, 2012'),
					tueDate = moment('Oct 23, 2012');
					day = 'tuesday';
				if (now.diff(monDate) < 0) {
					day = 'sunday'
				}
				else if (now.diff(tueDate) < 0) {
					day = 'monday';
				}
				
				Session.getForDay(day, function(ev) {
					if (e.success) {
						var data = [];
						for (var i = 0, l = ev.sessions.length; i<l; i++) {
							data.push(new ui.AgendaRow(ev.sessions[i]));
						}
						$.dailySchedule.setData(data);
					}
					else {
						ui.alert('networkGenericErrorTitle', 'agendaNetworkError');
					}
				});
			}
			
			//Grab latest status updates
			Status.query(function(e) {
				$.loading.stop();
				$.index.remove($.loading.getView());
				if (e.success) {
					var data = [];
					for (var i = 0, l = e.statuses.length; i<l; i++) {
						var status = e.statuses[i];
						if (status.photo && !status.photo.processed) continue;
						data.push(new ui.StatusRow(status));
					}
					$.streamTable.setData(data);
				}
				else {
					ui.alert('networkGenericErrorTitle', 'activityStreamError');
				}
			},10);
		}
		else {
			Ti.API.error('error fetching initial content: '+JSON.stringify(e));
			ui.alert('networkGenericErrorTitle', 'agendaNetworkError');
		}
	});
	
}

//Listen for status update, and refresh.
function startRefresh() {
	$.index.add($.loading.getView());
	$.loading.start();
	loadContent();
}
Ti.App.addEventListener('app:status.update', startRefresh);

//Fire manually when this view receives "focus"
$.on('focus', startRefresh);

//Go to activity stream
$.streamTable.addEventListener('click', function() {
	$.trigger('nav', {
		name:'stream'
	});
});

//Go to agenda
$.now.addEventListener('click', function() {
	$.trigger('nav', {
		name:'agenda'
	});
});






