var Cloud = require('ti.cloud');

$.logout.on('click', function() {
	Cloud.Users.logout(function(e) {
		if (e.success) {
			Ti.App.Properties.removeProperty('sessionId');
			Ti.Facebook.logout();
			Ti.App.fireEvent('app:logout');
		}
	});
});
