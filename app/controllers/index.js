//Facebook Configuration
Ti.Facebook.appid = Ti.App.Properties.getString('ti.facebook.appid');
Ti.Facebook.permissions = ['publish_stream'];

//Load cloud dependency, and store on Ti proxy to trick Studio code complete
var Cloud = require('ti.cloud');

//create view hierarchy components
$.dashboardView = Alloy.createController('DashboardView');
$.loginView = Alloy.createController('LoginView');

//Check Login Status
var sessionId = Ti.App.Properties.getString('sessionId');
if (sessionId) {
	$.index.add($.dashboardView.getView());
	$.dashboardView.getView().animate({
		opacity:1,
		duration:1000
	});
}
else {
	$.index.add($.loginView.getView());
	$.loginView.getView().animate({
		opacity:1,
		duration:1000
	});
}

//Monitor Login Status
Ti.App.addEventListener('app:login.success', function(e) {
	$.index.add($.dashboardView.getView());
	$.dashboardView.getView().animate({
		opacity:1,
		duration:1000
	});
	$.loginView.getView().animate({
		opacity:0,
		duration:1000
	}, function() {
		$.index.remove($.loginView.getView());
	});	
});

Ti.App.addEventListener('app:logout', function(e) {
	$.index.add($.loginView.getView());
	$.dashboardView.getView().animate({
		opacity:0,
		duration:1000
	}, function() {
		$.index.remove($.dashboardView.getView());
	});
	$.loginView.getView().animate({
		opacity:1,
		duration:1000
	});	
});

//Open initial window
$.index.open();