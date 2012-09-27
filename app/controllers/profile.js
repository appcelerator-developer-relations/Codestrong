var User = require('User'),
	ui = require('ui');
	
var userDetails = User.getUserDetails();

//Set up loading screen
$.loading = Alloy.createController('loading');

$.name.text = userDetails.attributes.firstname+' '+userDetails.attributes.lastname;
$.email.text = userDetails.email;
if (userDetails.attributes.organization) {
	$.org.text = userDetails.attributes.organization;
}
if (userDetails.attributes.title) {
	$.title.text = userDetails.attributes.title;
}

//Attempt to grab and use the current profile image
$.avatar.image = User.generateAvatarURL();

$.logout.on('click', function() {
	$.index.add($.loading.getView());
	User.logout(function(e) {
		$.index.remove($.loading.getView());
		if (e.success) {
			Ti.App.fireEvent('app:logout');
		}
		else {
			ui.alert('logoutError', 'logoutErrorText');
		}
	});
});

//Handle image attachment
$.avatar.on('click', function() {
	var od = Ti.UI.createOptionDialog({
		options:[L('photoGallery'), L('camera'), L('cancel')],
		cancel:2,
		title:L('chooseAvatar')
	});
	
	od.addEventListener('click', function(e) {
		var callbacks = {
			success: function(e) {
				var currentBlob = e.media;
				$.avatar.image = currentBlob;
				$.index.add($.loading.getView());
				User.assignProfilePhoto(currentBlob, function(e) {
					$.index.remove($.loading.getView());
				});
			},
			error: function(e) {
				ui.alert('mediaErrorTitle', 'mediaErrorText');
			}
		};
		
		//decide which media API to call
		if (e.index === 0) {
			Ti.Media.openPhotoGallery(callbacks);
		}
		else if (e.index === 1) {
			Ti.Media.showCamera(callbacks);
		}
	});

	if (OS_IOS) {
		od.show({
			view:$.camera
		});
	}
	else {
		od.show();
	}

});

//Update UI state for social connections
function fbOn() {
	$.facebookIcon.image = '/img/post/btn-facebook-on.png';
	$.facebookText.text = L('disconnectFacebook');
}

function fbOff() {
	$.facebookIcon.image = '/img/post/btn-facebook-off.png';
	$.facebookText.text = L('connectFacebook');
}

function twitterOn() {
	$.twitterIcon.image = '/img/post/btn-twitter-on.png';
	$.twitterText.text = L('disconnectTwitter');
}

function twitterOff() {
	$.twitterIcon.image = '/img/post/btn-twitter-off.png';
	$.twitterText.text = L('connectTwitter');
}

//Check if already logged in to Twitter or Facebook - default UI is disconnected
if (User.confirmLogin.toFacebook()) {
	fbOn();
}

if (User.confirmLogin.toTwitter()) {
	twitterOn();
}

//Toggle social connection state
$.facebook.on('click', function() {
	if (User.confirmLogin.toFacebook()) {
		User.logoutFacebook(function(e) {
			fbOff();
		});
	}
	else {
		User.linkToFacebook(function(e) {
			fbOn();
		});
	}
});

$.twitter.on('click', function() {
	if (User.confirmLogin.toTwitter()) {
		User.logoutTwitter(function(e) {
			twitterOff();
		});
	}
	else {
		User.linkToTwitter(function(e) {
			twitterOn();
		});
	}
});



