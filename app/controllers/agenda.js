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
$.loading.start();

//Load agenda data
Session.getAll(function(e) {
	$.loading.stop();
	$.index.remove($.loading.getView());
	if (e.success) {
		var sessions = e.sessions;
		for (var i = 0, l = sessions.length; i<l; i++) {
			var session = sessions[i],
				sessionStart = moment(session.start_time),
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
	
	//reset to day one if need be, since Android will not retain animation positions when a view has been unloaded from the hierarchy
	$.on('focus', function() {
		if ($.agendaTable && sunday.length > 0) {
			$.agendaTable && ($.agendaTable.setData(sunday));
			$.headerView.goTo(0);
		}
	});
}

//show session detail drawer
function showDetail(e) {
	var sessionData;
	if (OS_IOS) {
		sessionData = e.rowData.sessionObject;
	}
	else {
		//On android we have no row data, so we have to dig for it a bit...
		if (e.source.sessionObject) {
			sessionData = e.source.sessionObject;
		}
		else if (e.source.parent.sessionObject) {
			sessionData = e.source.parent.sessionObject;
		}
	}
	
	Ti.App.fireEvent('app:open.drawer', {
		controller:'sessionDetail',
		contextData:sessionData
	});
}
$.agendaTable && ($.agendaTable.addEventListener('click', showDetail));
$.sundayTable && ($.sundayTable.addEventListener('click', showDetail));
$.mondayTable && ($.mondayTable.addEventListener('click', showDetail));
$.tuesdayTable && ($.tuesdayTable.addEventListener('click', showDetail));


