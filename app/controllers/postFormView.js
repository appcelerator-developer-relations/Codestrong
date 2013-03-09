var ui = require('ui'),
	Status = require('Status'),
	User = require('User'),
	Cloud = require('ti.cloud'),
	currentBlob = null;
	
$.loading = Alloy.createController('loading');

//Bubble focus event
$.post.addEventListener('focus', function(e) {
	$.trigger('focus', e);
});

$.post.addEventListener('blur', function(e) {
	$.trigger('blur', e);
});

//Expose TextArea focus
$.focus = function() {
	$.post.focus();
};

$.blur = function() {
	$.post.blur();
};

//Handle image attachment
$.camera.addEventListener('click', function() {
	//for now, need to disable "choose from gallery" for android
	var options = [L('camera')];
	if (OS_IOS) {
		options.push(L('photoGallery'));
	}
	options.push(L('cancel'));
	
	var od = Ti.UI.createOptionDialog({
		options:options,
		cancel:options.length > 2 ? 2 : 1,
		title:L('attachPhoto')
	});
	
	od.addEventListener('click', function(e) {
		var callbacks = {
			success: function(e) {
				currentBlob = e.media;
				$.preview.image = currentBlob;
				$.camera.animate({
					opacity:0,
					duration:250
				}, function() {
					$.imagePreview.visible = true;
					$.imagePreview.animate({
						opacity:1,
						duration:250
					});
					updateCount();
				});
			},
			error: function(e) {
				ui.alert('mediaErrorTitle', 'mediaErrorText');
			}
		};
		
		//decide which media API to call
		if (e.index === 0) {
			Ti.Media.showCamera(callbacks);
		}
		else if (e.index === 1 && options.length > 2) {
			Ti.Media.openPhotoGallery(callbacks);
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

$.deleteButton.addEventListener('click', function() {
	$.imagePreview.animate({
		opacity:0,
		duration:250
	}, function() {
		$.camera.animate({
			opacity:1,
			duration:250
		}, function() {
			$.imagePreview.visible = false;
			$.preview.image = '';
			currentBlob = null;
			updateCount();
		});
	});
});

//Manage social connection state
var fbOn = false;
$.facebook.addEventListener('click', function() {
	if (!fbOn) {
		function setOn() {
			fbOn = true;
			$.facebook.backgroundImage = '/img/post/btn-facebook-on.png';
		}
		
		if (User.confirmLogin.toFacebook()) {
			setOn();
		}
		else {
			User.linkToFacebook(function(e) {
				setOn();
			});
		}
	}
	else {
		fbOn = false;
		$.facebook.backgroundImage = '/img/post/btn-facebook-off.png';
	}
});

var twitterOn = false;
$.twitter.addEventListener('click', function() {
	if (!twitterOn) {
		function setOn() {
			twitterOn = true;
			$.twitter.backgroundImage = '/img/post/btn-twitter-on.png';
			updateCount();
			$.characters.visible = true;
		}
		
		if (User.confirmLogin.toTwitter()) {
			setOn();
		}
		else {
			User.linkToTwitter(function(e) {
				setOn();
			});
		}
	}
	else {
		twitterOn = false;
		$.characters.visible = true;
		$.twitter.backgroundImage = '/img/post/btn-twitter-off.png';
		updateCount();
		$.characters.visible = false;
	}
});

//Track character count
var count = 140;
function updateCount() {
	var startNumber = (currentBlob) ? 118 : 140
	count = startNumber - $.post.value.length;
	$.characters.color = (count >= 0) ? '#000' : '#ff0000';
	$.characters.text = count;
}
$.post.addEventListener('change', updateCount);

//track social post status, don't be done til these come back
$.submit.addEventListener('click', function() {
	if ($.post.value || currentBlob) {
		
		//exit if content is not valid - TODO: put in better validation and feedback
		if ((twitterOn && currentBlob && $.post.value.length > 118) ||
			(twitterOn && !currentBlob && $.post.value.length > 140)) {
			ui.alert('tooLong', 'tooLongMessage');
			return;
		}
		
		var currentPost = $.post.value;
		$.postContainer.add($.loading.getView());
		$.loading.start();
		Status.create({
			message:(currentPost === '') ? 'Just uploaded from @codestrong 2012!' : currentPost, //empty string - status update tangram requires a message
			photo:currentBlob
		}, function(e) {
			if (e.success) {				
				//Cool, it's in ACS, now ship it to any social channels
				if (twitterOn || fbOn) {
					var args = {
						success: function(ev) {
							$.loading.stop();
							$.postContainer.remove($.loading.getView());
							ui.alert('updateSuccessTitle', 'updateSuccessText');
							$.trigger('success');
							Ti.App.fireEvent('app:status.update', {
								withPhoto:(currentBlob) ? true : false //don't want to pass a reference to the blob
							});
						},
						error: function(ev) {
							$.loading.stop();
							$.postContainer.remove($.loading.getView());
							Ti.API.error('Error on social post: '+ev);
							ui.alert('updateErrorTitle', 'updateErrorText');
						}
					};
					
					//Handle twitter posting
					if (twitterOn) {
						if (currentBlob) {
							//For twitter, we need to grab the URL of the original image on ACS
							//Need to delay in order for ACS to process the images and return us URLs
							//TODO: Brittle as F - maybe do an interval?
							setTimeout(function() {
								Cloud.Statuses.query({
									limit:1,
									where:{
										user_id:e.status.user.id
									},
									order:'-created_at'
								}, function(pe) {
									if (pe.success) {
										args.message = currentPost+': '+pe.statuses[0].photo.urls.original
										User.tweet(args);
									}
									else {
										args.error(pe);
									}
								});
							},5000);
						}
						else {
							args.message = currentPost;
							User.tweet(args);
						}
					}
					
					//Handle FB posting
					if (fbOn) {
						args.message = currentPost;
						args.image = currentBlob;
						User.facebookPost(args);
					}
				}
				else {
					$.loading.stop();
					$.postContainer.remove($.loading.getView());
					ui.alert('updateSuccessTitle', 'updateSuccessText');
					$.trigger('success');
					Ti.App.fireEvent('app:status.update', {
						withPhoto:(currentBlob) ? true : false //don't want to pass a reference to the blob
					});
				}
			}
			else {
				$.loading.stop();
				$.postContainer.remove($.loading.getView());
				Ti.API.error('Error on ACS post: '+e);
				ui.alert('updateErrorTitle', 'updateErrorText');
			}
		});
	}
});

//Reset UI for next post
$.reset = function() {
	//reset social
	fbOn = false;
	$.facebook.backgroundImage = '/img/post/btn-facebook-off.png';
	twitterOn = false;
	$.twitter.backgroundImage = '/img/post/btn-twitter-off.png';
	
	//reset post
	$.post.value = '';
	count = 140;
	$.characters.text = count;
	$.characters.visible = false;
	
	//reset image
	currentBlob = null;
	$.imagePreview.visible = false;
	$.imagePreview.opacity = 0;
	$.preview.image = '';
	$.camera.opacity = 1;
};

