//dependencies
var Cloud = require('ti.cloud'),
	Gravitas = require('gravitas'),
	social = require('alloy/social');
	
//Create a Twitter client for this module
var twitter = social.create({
	consumerSecret:Ti.App.Properties.getString('twitter.consumerSecret'),
	consumerKey:Ti.App.Properties.getString('twitter.consumerKey')
});

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

//Check social login
User.confirmLogin.toFacebook = function() {
	return Ti.Facebook.loggedIn;
};

User.confirmLogin.toTwitter = function() {
	return twitter.isAuthorized();
};

//Link to Facebook
User.linkToFacebook = function(cb) {
	Ti.Facebook.addEventListener('login', function(e) {
		cb && cb(e);
	});
	Ti.Facebook.authorize();
};
User.logoutFacebook = function(cb) {
	Ti.Facebook.addEventListener('logout', function(e) {
		cb && cb(e);
	});
	Ti.Facebook.logout();
};

//Link to Twitter
User.linkToTwitter = function(cb) {
	twitter.authorize(cb);
};
User.logoutTwitter = function(cb) {
	twitter.deauthorize();
	cb && cb();
};

//Hmm, not sure if this REALLY belongs in a user model, but sharing features going here...
/*
 * Argument format:
 * {
 * 	 message: 'a string to share',
 *   success: function() {},
 *   error: function() {}
 * }
 */
User.tweet = function(args) {
	twitter.share({
		message:args.message,
		success:args.success,
		error:args.error
	});
};

/*
 * Argument format:
 * {
 * 	 message: 'a string to share',
 *   image: aReferenceToATitaniumBlob, //optional
 *   success: function() {},
 *   error: function() {}
 * }
 */
User.facebookPost = function(args) {
	if (!Ti.Network.online) {
		args.error({
			success:false
		});
		return;
	}
	
	if (args.image) {
		Ti.Facebook.requestWithGraphPath('me/photos', {
			message:args.message,
			picture:args.image
		}, 'POST', function(e){
		    if (e.success) {
		        args.success && args.success(e);
		    } 
		    else {
		        args.error && args.error(e);
		    }
		});
	}
	else {
		Ti.Facebook.requestWithGraphPath('me/feed', {
			message: args.message
		}, 'POST', function(e) {
		    if (e.success) {
		        args.success && args.success(e);
		    } 
		    else {
		        args.error && args.error(e);
		    }
		});
	}
};

//Log in an Appcelerator network user
User.login = function(username, password, success, error) {
	if (!Ti.Network.online) {
		error({
			success:false
		});
		return;
	}
	
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
	if (!Ti.Network.online) {
		cb({
			success:false
		});
		return;
	}
	
	Cloud.Users.logout(function(e) {
		if (e.success) {
			if (User.confirmLogin.toFacebook()) {
				User.logoutFacebook();
			}
			if (User.confirmLogin.toTwitter()) {
				User.logoutTwitter();
			}
			Ti.App.Properties.removeProperty('sessionId');
		}
		cb(e);
	});
};

//Assign the given photo as the profile photo for the current user
User.assignProfilePhoto = function(blob, cb) {
	if (!Ti.Network.online) {
		cb({
			success:false
		});
		return;
	}
	
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
