var User = require('User'),
	ui = require('ui');

$.logout.on('click', function() {
	User.logout(function(e) {
		if (e.success) {
			Ti.App.fireEvent('app:logout');
		}
		else {
			ui.alert('logoutError', 'logoutErrorText');
		}
	});
});
