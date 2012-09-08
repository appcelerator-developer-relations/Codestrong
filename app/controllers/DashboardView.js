var Cloud = require('ti.cloud');

$.logout.on('click', function() {
	Cloud.Users.logout(function(e) {
		if (e.success) {
			Ti.App.Properties.removeProperty('sessionId');
			
			var externalStr = Ti.App.Properties.hasProperty('externalAccounts');
			var external = externalStr ? JSON.parse(externalStr) : [];
			
			Ti.App.fireEvent('app:logout');
		}
	});
});
