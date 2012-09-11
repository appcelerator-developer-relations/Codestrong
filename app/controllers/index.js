//Facebook Configuration
Ti.Facebook.appid = Ti.App.Properties.getString('ti.facebook.appid');
Ti.Facebook.permissions = ['publish_stream'];

//Load cloud dependency, and store on Ti proxy to trick Studio code complete
var Cloud = require('ti.cloud');

//create view hierarchy components
$.loginView = Alloy.createController('LoginView');
$.dashboardView = Alloy.createController('DashboardView');

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

//Lock orientation modes for handheld
if (!Alloy.isTablet) {
	$.index.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
}

//Open initial window
$.index.open();

/* 
//NOTE: Ambient simultaneous animations are currently too janky for android.  Shelving for now


//Start ambient cloud animations.  Could this be smarterer?  Definitely, but,
//had some problems setting a function-scoped variable to a global TODO
var animationDuration = 8000,
	animations = {
	cloud2: '-10dp',
	cloud3: '-10dp',
	cloud4: '-10dp',
	cloud5: '-10dp'
};

function doMove(obj, currentAnimation, direction) {
	//kick off animation
	var animateArgs = {
		duration:animationDuration
	};
	animateArgs[direction] = currentAnimation;
	obj.animate(animateArgs);
}

//stagger cloud animations...
doMove($.cloud2, animations.cloud2, 'left');
setInterval(function() {
	doMove($.cloud2, animations.cloud2, 'left');
	//set for next
	animations.cloud2 = (animations.cloud2 === '-10dp') ? '-50dp' : '-10dp';
}, animationDuration+500);

doMove($.cloud3, animations.cloud3, 'right');
setInterval(function() {
	doMove($.cloud3, animations.cloud3, 'right');
	//set for next
	animations.cloud3 = (animations.cloud3 === '-10dp') ? '-50dp' : '-10dp';
}, animationDuration+100);

doMove($.cloud4, animations.cloud4, 'left');
setInterval(function() {
	doMove($.cloud4, animations.cloud4, 'left');
	//set for next
	animations.cloud4 = (animations.cloud4 === '-10dp') ? '-50dp' : '-10dp';
}, animationDuration+1000);

doMove($.cloud5, animations.cloud5, 'right');
setInterval(function() {
	doMove($.cloud5, animations.cloud5, 'right');
	//set for next
	animations.cloud5 = (animations.cloud5 === '-10dp') ? '-50dp' : '-10dp';
}, animationDuration+1500);
*/
