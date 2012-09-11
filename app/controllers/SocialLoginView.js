//depdenencies
var social = require('alloy/social'),
	Cloud = require('ti.cloud');

//Set up static properties on view elements
$.email.hintText = L('email');
$.password.hintText = L('password');

//ivars
var selectedAction = 0; //0 - sign up, 1 - log in

//private functions
function loginHandler(e) {
	if (e.success) {
		$.scroller.scrollToView(0);
		//Store the current value of the Cloud session for later use, and notify app of success
		Ti.App.Properties.setString('sessionId', Cloud.sessionId);
		Ti.App.fireEvent('app:login.success');
	}
	else {
		//TODO robust error handling
		alert('Login Error: '+e.message);
	}
}

//Handle social logins
function socialLogin() {
	var socialIntegrationArgs = {},
		authorized = false;
		
	if (Ti.Facebook.loggedIn) {
		authorized = true;
        socialIntegrationArgs = {
            type: 'facebook',
            token: Ti.Facebook.accessToken
        };
    }
    else if (social.isAuthorized()) {
    	authorized = true;
        socialIntegrationArgs = {
            type: 'facebook',
            token: Ti.Facebook.accessToken
        };
    }
    
    //Link account if authorized
    authorized && (Cloud.SocialIntegrations.externalAccountLogin(socialIntegrationArgs, loginHandler));
}

Ti.Facebook.addEventListener('login', socialLogin);

//event handlers

//iOS needs a little extra space on field focus for logins to dodge the sw keyboard...
//Alloy will actually optimize this out at compile time for Android and mobile web...
if (OS_IOS) {
	var focused = false;
	
	function doScroll(bot, force) {
		//Short circuit to animation as quickly as possible
		if (force || !Alloy.isTablet || Ti.Gesture.orientation === Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation === Ti.UI.LANDSCAPE_RIGHT ) {
			$.wrapper.animate({
				bottom:bot,
				duration:250
			});
		}
	}
	
	function moveScrollerUp() {
		focused = true;
		doScroll(120);
	}
	
	function moveScrollerDown() {
		focused = false;
		doScroll(10);
	}
	
	$.email.on('focus', moveScrollerUp);
	$.password.on('focus', moveScrollerUp);
	$.email.on('blur', moveScrollerDown);
	$.password.on('blur', moveScrollerDown);
	
	//Always reset on orientation change for tablet
	if (Alloy.isTablet) {
		Ti.Gesture.addEventListener('orientationchange', function(e) {
			if (focused) {
				if (e.orientation === Ti.UI.PORTRAIT || e.orientation === Ti.UI.UPSIDE_PORTRAIT) {
					doScroll(10,true);
				}
				else {
					doScroll(120,true);
				}
			}
		});
	}
}

$.fb.on('click', function() {
	Ti.Facebook.authorize();
});

$.twitter.on('click', function() {
	social.authorize(socialLogin);
});

$.uhwhat.on('touchend', function() {
	selectedAction = 0;
	$.action.title = L('signup');
	$.header.text = L('thatscool');
	$.scroller.scrollToView(1);
});

$.alreadyDid.on('touchend', function() {
	selectedAction = 1;
	$.action.title = L('login');
	$.header.text = L('ohnice');
	$.scroller.scrollToView(1);
});

$.cancel.on('touchend', function() {
	$.scroller.scrollToView(0);
});

$.action.on('touchend', function() {
	if (selectedAction === 0) {
		//create new user - TODO: validate e-mail, make user confirm password		
		Cloud.Users.create({
			email:$.email.value,
			first_name:'Codestrong', //ask for more info if we need it - I hate when I have to do everything up front
			last_name:'User',
			password:$.password.value,
			password_confirmation:$.password.value
		}, loginHandler);
	}
	else {
		//log in existing
		Cloud.Users.login({
			login:$.email.value,
			password:$.password.value
		}, loginHandler);
	}
});