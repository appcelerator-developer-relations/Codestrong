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
Ti.App.addEventListener('app:status.update', loadContent);

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






