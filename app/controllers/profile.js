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
