//Dependencies
var User = require('User'), 
	ui = require('ui');
	
$.loading = Alloy.createController('loading');

//Generic login error - TODO: make these more specific
function showError() {
	ui.alert('loginError', 'loginErrorText');
}

//Static config of hintText, which lacks auto-localization
$.email.hintText = L('email');
$.password.hintText = L('password');

//iOS needs a little extra space on field focus for logins to dodge the sw keyboard...
//Alloy will actually optimize this out at compile time for Android and mobile web...
if (OS_IOS) {
	function doScroll(val, force) {
		//Short circuit to animation as quickly as possible
		if (!Alloy.isTablet) {
			$.index.animate({
				top:$.index.rect.y + val,
				duration:250
			});
		}
	}
	
	function moveScrollerUp() {
		doScroll(-180);
	}
	
	function moveScrollerDown() {
		doScroll(180);
	}
	
	$.email.on('focus', moveScrollerUp);
	$.password.on('focus', moveScrollerUp);
	$.email.on('blur', moveScrollerDown);
	$.password.on('blur', moveScrollerDown);
}

//Login using network creds
$.login.on('click', function() {
	$.index.parent.add($.loading.getView());
	$.loading.start();
	$.email.blur();
	$.password.blur();
	User.login($.email.value, $.password.value, function(e) {
		$.trigger('loginSuccess', e);
		$.password.value = '';
		$.loading.stop();
		$.index.parent.remove($.loading.getView());
	}, function() {
		$.loading.stop();
		$.index.parent.remove($.loading.getView());
		showError();
	});
});

//Go to signup page
$.create.on('click', function() {
	$.email.blur();
	$.password.blur();
	Ti.Platform.openURL('https://my.appcelerator.com/auth/signup');
});

//Password reset 
$.forgot.on('click', function() {
	$.email.blur();
	$.password.blur();
	Ti.Platform.openURL('https://my.appcelerator.com/auth/reset');
});

//Public component API for resetting this view
$.reset = function() {
	
};

//Public component API for initializing this view
$.init = function() {
	$.logo.animate({
		top:'20dp',
		duration:250
	}, function() {
		//fade in login contents
		$.loginContents.animate({
			opacity:1,
			duration:250
		}, function() {
			//slide in buttons
			$.login.animate({
				right:0,
				opacity:1,
				duration:250
			});
			$.create.animate({
				left:0,
				opacity:1,
				duration:250
			});
		});
	});
};
