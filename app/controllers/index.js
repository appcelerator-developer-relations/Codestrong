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
Ti.API.info('stored:'+sessionId);
if (sessionId) {
	Cloud.sessionId = sessionId;
	$.index.remove($.logo);
	$.index.add($.dashboardView.getView());
}
else {
	$.index.remove($.logo);
	$.index.add($.loginView.getView());
}

//Monitor Login Status
Ti.App.addEventListener('app:login.success', function(e) {
	$.index.add($.dashboardView.getView());
	$.index.remove($.loginView.getView());
});

Ti.App.addEventListener('app:logout', function(e) {
	$.index.remove($.dashboardView.getView());
	$.index.add($.loginView.getView());
});

//Open initial window
$.index.open();