var ui = require('ui'),
	moment = require('moment'),
	Status = require('Status'),
	Session = require('Session');
	
$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

function loadContent() {
	//Grab current agenda item
	Session.getNext(function(e) {
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
			$.index.remove($.loading.getView());
			if (e.success) {
				var data = [];
				for (var i = 0, l = e.statuses.length; i<l; i++) {
					data.push(new ui.StatusRow(e.statuses[i]));
				}
				$.streamTable.setData(data);
			}
			else {
				ui.alert('networkGenericErrorTitle', 'activityStreamError');
			}
		},10);
	});
	
}

//Listen for status update, and refresh.
Ti.App.addEventListener('app:status.update', function(e) {
	if (e.withPhoto && Ti.Platform.osname === 'android') {
		//swallow this for now - if we try to assign a URL to an image view we crash, so avoid doing it for now
	}
	else {
		loadContent();
	}
});

//Fire manually when this view receives "focus"
$.on('focus', loadContent);

//Go to activity stream
$.streamTable.on('click', function() {
	$.trigger('nav', {
		name:'stream'
	});
});

//Go to agenda
$.now.on('click', function() {
	$.trigger('nav', {
		name:'agenda'
	});
});






