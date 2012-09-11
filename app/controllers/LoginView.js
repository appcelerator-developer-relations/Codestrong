var Cloud = require('ti.cloud');

//Static config of hintText, which lacks auto-localization
$.email.hintText = L('email');
$.password.hintText = L('password');

//Generic login error - TODO: make these more specific
function showError() {
	var d = Ti.UI.createAlertDialog({
		title:L('loginError'),
		message:L('loginErrorText')
	}).show();
}

//Log in using an Appcelerator Developer account
function networkLogin(username, password, success, error) {
	var xhr = Ti.Network.createHTTPClient();

	//Parity issue: iOS fires onload for 4xx and 3xx status codes, so need to manually check onload
	xhr.onload = function() {
		Ti.API.info('Status Code: '+ xhr.status);
		Ti.API.info('Set-Cookie: '+ xhr.getResponseHeader('Set-Cookie'));
		Ti.API.info('responseText: '+ xhr.responseText);
		try {
			if (xhr.status == 200) {
				var sessionId = '',
					userDetails;
				
				//return the session ID to store in ACS
				if (this.responseText) {
					//throw in network details for later use
					Ti.App.Properties.setString('networkDetails', this.responseText);
					userDetails = JSON.parse(this.responseText);
					sessionId = userDetails.sid;
				}
				
				success(sessionId, userDetails);
			}
			else {
				Ti.API.error('Error code received from server: '+xhr);
				error();
			}
		}
		catch(e) {
			Ti.API.error('Exception processing response: '+e);
			showError();
		}
	};
	
	xhr.onerror = function() {
		Ti.API.error('Login Request Error:');
		Ti.API.error('Status Code: '+ xhr.status);
		Ti.API.error('Set-Cookie: '+ xhr.getResponseHeader('Set-Cookie'));
		Ti.API.error('responseText: '+ xhr.responseText);
		error();
	};
	
	xhr.open('POST', 'https://api.appcelerator.net/p/v1/sso-login');
	xhr.send({
		un:username,
		pw:password,
		mid:Ti.Platform.id
	});
}

//helper to toggle button
function btnToggle(on) {
	$.login.enabled = on;
	$.login.title = on ? L('login') : L('authenticating');
}


$.login.on('click', function() {
	if ($.login.enabled) {
		$.email.blur();
		$.password.blur();
		btnToggle();
		
		networkLogin($.email.value, $.password.value, function(sessionId) {
			//Associate an Appcelerator developer login with an ACS account
			Cloud.SocialIntegrations.externalAccountLogin({
				id:$.email.value,
				type: 'appc',
	            token: sessionId
			}, function(e) {
				if (e.success) {
					//Store the current value of the Cloud session for later use, and notify app of success
					Ti.App.Properties.setString('sessionId', Cloud.sessionId);
					Ti.App.fireEvent('app:login.success');
					btnToggle(true);
				}
				else {
					Ti.API.error('Social Integration Error');
					showError();
					btnToggle(true);
				}
			});
		}, function() {
			//Prompt to recheck info
			$.password.value = '';
			$.password.focus();
			showError();
			btnToggle(true);
		});
	}	
});

$.noAppcNetwork.on('click', function() {
	Ti.Platform.openURL('https:/my.appcelerator.com/auth/signup');
});

//Place initial focus on e-mail field
setTimeout(function() {
	$.email.focus();
},300);


