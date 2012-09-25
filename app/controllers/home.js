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
		$.title.text = session.title;
		$.presenter.text = session.presenter;
		$.location.text = session.location;
		
		//TODO: replace with actually getting full day
		if ($.dailySchedule) {
			$.dailySchedule.setData([new ui.AgendaRow(session)]);
		}
	});
	
	//Grab latest status updates
	Status.query(function(e) {
		$.index.remove($.loading.getView());
		if (e.success) {
			if (Alloy.isTablet) {
				var data = [];
				for (var i = 0, l = e.statuses.length; i<l; i++) {
					data.push(new ui.StatusRow(e.statuses[i]));
				}
				$.stream.setData(data);
			}
			else {
				var s = e.statuses[0];
				var created = moment(s.created_at);
				
				$.avatar.image = s.custom_fields.avatar;
				$.name.text = s.custom_fields.name;
				$.time.text = created.fromNow();
				$.status.text = s.message;
			}
		}
		else {
			ui.alert('networkGenericErrorTitle', 'activityStreamError');
		}
	},Alloy.isTablet ? 10 : 1);
}

//Listen for status update, and refresh.
Ti.App.addEventListener('app:status.update', loadContent);

//Fire manually when this view receives "focus"
$.on('focus', loadContent);

//Go to activity stream
$.stream.on('click', function() {
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






