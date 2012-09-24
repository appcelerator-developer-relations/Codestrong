//dependencies
var Cloud = require('ti.cloud'),
	Gravitas = require('gravitas'),
	social = require('alloy/social');

//Empty constructor (for now)
function User() {}

/*
 * Static model functions
 */

//Check for a current login session ID - if we have one, configure cloud, if not, return false
User.confirmLogin = function() {
	var auth = false;
	if (Ti.App.Properties.hasProperty('sessionId')) {
		//set up cloud module to use saved session
		Cloud.sessionId = Ti.App.Properties.getString('sessionId');
		auth = true;
	}
	
	return auth;
};

//Link to Facebook
User.linkToFacebook = function(cb) {
	
};

//Link to Twitter
User.linkToTwitter = function(cb) {
	
};

//Log in an Appcelerator network user
User.login = function(username, password, success, error) {
	var xhr = Ti.Network.createHTTPClient();

	//Parity issue: iOS fires onload for 4xx and 3xx status codes, so need to manually check onload
	xhr.onload = function() {
		Ti.API.info('Status Code: ' + xhr.status);
		Ti.API.info('Set-Cookie: ' + xhr.getResponseHeader('Set-Cookie'));
		Ti.API.info('responseText: ' + xhr.responseText);
		try {
			if (xhr.status == 200) {
				var sessionId = '', userDetails;

				if (this.responseText) {
					//throw in network details for later use
					Ti.App.Properties.setString('networkDetails', this.responseText);
					userDetails = JSON.parse(this.responseText);
					sessionId = userDetails.sid;
				}

				//Associate an Appcelerator developer login with an ACS account
				Cloud.SocialIntegrations.externalAccountLogin({
					id : userDetails.guid,
					type : 'appc',
					token : sessionId
				}, function(e) {
					if (e.success) {
						//Store the current value of the Cloud session for later use, and notify app of success
						Ti.App.Properties.setString('sessionId', Cloud.sessionId);
						success(userDetails);
					} else {
						Ti.API.error('Social Integration Error: ' + e);
						error(xhr);
					}
				});
			} else {
				Ti.API.error('Error code received from server: ' + xhr);
				error(xhr);
			}
		} catch(e) {
			Ti.API.error('Exception processing response: ' + e);
			error(xhr);
		}
	};

	xhr.onerror = function() {
		Ti.API.error('Login Request Error:');
		Ti.API.error('Status Code: ' + xhr.status);
		Ti.API.error('Set-Cookie: ' + xhr.getResponseHeader('Set-Cookie'));
		Ti.API.error('responseText: ' + xhr.responseText);
		error(xhr);
	};

	xhr.open('POST', 'https://api.appcelerator.net/p/v1/sso-login');
	xhr.send({
		un : username,
		pw : password,
		mid : Ti.Platform.id
	});
};

//Retrieve user network details
User.getUserDetails = function() {
	var deets;
	if (Ti.App.Properties.hasProperty('networkDetails')) {
		try {
			deets = JSON.parse(Ti.App.Properties.getString('networkDetails'));
		}
		catch (e) { 
			Ti.API.error('Error parsing user details: '+e);
			//swallow, if we barf on this we'll return falsy 
		}
	}
	return deets;
};

//Generate an avatar image associated with this user
User.generateAvatarURL = function() {
	//prefer stored property
	if (Ti.App.Properties.hasProperty('profileImage')) {
		return Ti.App.Properties.getString('profileImage');
	}
	
	//Fallback to Gravatar URL
	var deets = User.getUserDetails();
	return Gravitas.createGravatar({
		email:deets.email,
		size:44
	});
};

//Log out the current user
User.logout = function(cb) {
	Cloud.Users.logout(function(e) {
		if (e.success) {
			Ti.App.Properties.removeProperty('sessionId');
		}
		cb(e);
	});
};

//Assign the given photo as the profile photo for the current user
User.assignProfilePhoto = function(blob, cb) {
	Cloud.Users.update({
		photo:blob
	}, function(e) {
		var usr = e.users[0];
		if (e.success) {
			//Now, grab the profile image URL...
			Cloud.Users.showMe(function(ev) {
				if (ev.success) {
					var me = ev.users[0]
					Ti.App.Properties.setString('profileImage', me.photo.urls.square_75);
				}
				cb(e);
			});
			cb(e);
		}
		cb(e);
	});
};


//Export constructor function as public interface
module.exports = User;
