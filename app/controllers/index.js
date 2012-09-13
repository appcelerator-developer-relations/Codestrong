//Dependencies
var User = Alloy.getModel('User');

//Generic login error - TODO: make these more specific
function showError() {
	var d = Ti.UI.createAlertDialog({
		title:L('loginError'),
		message:L('loginErrorText')
	}).show();
}

//zoom action
function zoom(view, callback) {
	var matrix = Ti.UI.create2DMatrix({ scale:1.5 });
        
	view.animate({ 
		transform:matrix, 
		opacity:0.0, 
		duration:250 
	}, function() {
    	callback();
	});
        
}

//Handle field movement (iOS only)
if (OS_IOS) {
	function onFocus(e) {
	    $.parent.animate({ 
	    	top:"-130dp", 
	    	duration:250 
	    });
	}
		
	function onBlur(e) {
	    $.parent.animate({ 
	    	top:0, 
	    	duration:250 
	    });
	}
	
	$.username.on('focus', onFocus);
	$.password.on('focus', onFocus);
	$.username.on('blur', onBlur);
	$.password.on('blur', onBlur);
}

$.parent.on('click', function(e) {
    $.username.blur();
    $.password.blur();
});

$.loginBtn.on('click', function(e) {
	User.login($.username.value, $.password.value, function() {
		zoom($.parent, function() {
            var App = Alloy.createController('app');
			App.openWindow();
        });
	}, function() {
		showError();
	});
});

$.createBtn.on('click', function(e) {
    Ti.Platform.openURL('https://my.appcelerator.com/auth/signup');
});

$.parent.on('open', function(e) {
    $.logo.animate({ top:"28dp", duration:250 });
    
    $.header.animate({ top:"265dp", opacity:0.0, duration:250 }, function() {
        
        $.loginInput.animate({ top:"206dp", opacity:1.0, duration:250 }, function() {
            $.createBtn.animate({ left:0, opacity:1.0, duration:250 });
            $.loginBtn.animate({ right:0, opacity:1.0, duration:250 });
        });
        
    });
    
});

//Lock orientation modes for handheld
if (!Alloy.isTablet) {
	$.parent.orientationModes = [
		Ti.UI.PORTRAIT,
		Ti.UI.UPSIDE_PORTRAIT
	];
}

//Decide whether or not to open the login window, based on if we have a stored session.
if (Ti.App.Properties.hasProperty('sessionId')) {
	//set up cloud module to use saved session
	var Cloud = require('ti.cloud');
	Cloud.sessionId = Ti.App.Properties.getString('sessionId');
	
	//go straight to main app view
	var App = Alloy.createController('app');
	App.openWindow();
}
else {
	// Open loader/login window.
	// Delay for demo.
	setTimeout(function() {
	    $.parent.open();
	}, 300);
}