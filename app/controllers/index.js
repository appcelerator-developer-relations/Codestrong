//Global config
Ti.UI.setBackgroundImage('/img/general/bg-interior.png');

//Dependencies
var User = require('User'),
	ui = require('ui');

//create view hierarchy components
$.login = Alloy.createController('login');
$.main = Alloy.createController('main');

//Check Login Status
if (User.confirmLogin()) {
	$.index.add($.main.getView());
	$.main.init();
}
else {
	$.index.add($.login.getView());
	$.login.init();
}

//Monitor Login Status
$.login.on('loginSuccess', function(e) {
	$.index.add($.main.getView());
	ui.zoom($.login.getView(), function() {
		ui.unzoom($.main.getView(), function() {
			$.main.init();
		});
	});
});

//Look for global logout event
Ti.App.addEventListener('app:logout', function(e) {
	$.index.add($.login.getView());
	$.login.init();
	ui.zoom($.main.getView(), function() {
		ui.unzoom($.login.getView());
	});
});

//Lock orientation modes for handheld
if (!Alloy.isTablet) {
	$.index.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
}

//TODO: At some point, a better UX would be to close open drawers until there are none, and then exit
if (Ti.Platform.osname === 'android') {
	$.index.addEventListener('android:back', function() {
		var od = Ti.UI.createOptionDialog({
			title:L('leave'),
			options:[L('ok'), L('cancel')],
			cancel:1
		});
		
		od.addEventListener('click', function(e) {
			e.index === 0 && ($.index.close());
		});
		
		od.show();
	});
}

//Open initial window
$.index.open();
