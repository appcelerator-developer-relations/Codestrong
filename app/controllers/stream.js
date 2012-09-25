var ui = require('ui'),
	Status = require('Status');
	
$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

function loadRows() {
	Status.query(function(e) {
		$.index.remove($.loading.getView());
		if (e.success) {
			var td = [];
			for (var i = 0, l = e.statuses.length; i<l; i++) {
				var status = e.statuses[i];
				td.push(new ui.StatusRow(status));
			}
			$.table.setData(td);
		}
		else {
			ui.alert('networkGenericErrorTitle', 'activityStreamError');
		}
	});
}

//Listen for status update, and refresh.
Ti.App.addEventListener('app:status.update', loadRows);

//Fire manually when this view receives "focus"
$.on('focus', loadRows);