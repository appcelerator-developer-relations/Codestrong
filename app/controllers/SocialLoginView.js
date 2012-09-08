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

//Handle Facebook Login
function fbLogin() {
	if (Ti.Facebook.loggedIn) {
        Cloud.SocialIntegrations.externalAccountLogin({
            type: 'facebook',
            token: Ti.Facebook.accessToken
        }, loginHandler);
    }
}
Ti.Facebook.addEventListener('login', fbLogin);

//event handlers

//iOS needs a little extra space on field focus for logins to dodge the sw keyboard...
//Alloy will actually optimize this out at compile time for Android and mobile web...
if (OS_IOS) {
	function moveScrollerUp() {
		$.wrapper.animate({
			bottom:120,
			duration:250
		});
	}
	
	function moveScrollerDown() {
		$.wrapper.animate({
			bottom:10,
			duration:250
		});
	}
	
	$.email.on('focus', moveScrollerUp);
	$.password.on('focus', moveScrollerUp);
	$.email.on('blur', moveScrollerDown);
	$.password.on('blur', moveScrollerDown);
}

$.fb.on('click', function() {
	Ti.Facebook.authorize();
});

$.twitter.on('click', function() {
	alert('removed twitter login for now');
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