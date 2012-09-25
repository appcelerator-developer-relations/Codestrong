var moment = require('moment'),
	ui = require('ui'),
	Session = require('Session');
	
//Session table view data and conference dates
var sunday = [],
	monday = [],
	tuesday = [],
	monDate = moment('Oct 22, 2012'),
	tueDate = moment('Oct 23, 2012');
	
$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

//Load agenda data
Session.getAll(function(e) {
	$.index.remove($.loading.getView());
	if (e.success) {
		var sessions = e.sessions;
		for (var i = 0, l = sessions.length; i<l; i++) {
			var session = sessions[i],
				sessionStart = moment(session.start),
				row = new ui.AgendaRow(session);
			
			if (sessionStart.diff(monDate) < 0) {
				sunday.push(row);
			}
			else if (sessionStart.diff(tueDate) < 0) {
				monday.push(row);
			}
			else {
				tuesday.push(row);
			}
		}
		if (Alloy.isTablet) {
			$.sundayTable.setData(sunday);
			$.mondayTable.setData(monday);
			$.tuesdayTable.setData(tuesday);
		}
		else {
			$.agendaTable.setData(sunday);
		}
	}
	else {
		Ti.API.error('Error fetching session data: '+e);
		ui.alert('networkGenericErrorTitle', 'agendaNetworkError');
	}
});

//Create handheld UI and controls
if (!Alloy.isTablet) {
	$.headerView = new ui.HeaderView({
		title:'agendaCaps',
		optionWidth:70,
		options:['sun', 'mon', 'tue']
	});
	$.headerViewContainer.add($.headerView);
	
	$.headerView.on('change', function(e) {
		if (e.selection === 'sun') {
			$.agendaTable.setData(sunday);
		}
		else if (e.selection === 'mon') {
			$.agendaTable.setData(monday);
		}
		else {
			$.agendaTable.setData(tuesday);
		}
	});
}


