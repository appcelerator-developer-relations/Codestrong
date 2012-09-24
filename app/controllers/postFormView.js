var ui = require('ui'),
	Status = require('Status'),
	currentBlob = null;
	
$.loading = Alloy.createController('loading');

//Bubble focus event
$.post.on('focus', function(e) {
	$.trigger('focus', e);
});

$.post.on('blur', function(e) {
	$.trigger('blur', e);
});

//Expose TextArea focus
$.focus = function() {
	$.post.focus();
};

$.blur = function() {
	$.post.blur();
};

//Track character count
var count = 140;
$.post.on('change', function() {
	count = 140 - $.post.value.length;
	$.characters.color = (count >= 0) ? '#000' : '#ff0000';
	$.characters.text = count;
});

$.submit.on('click', function() {
	if ($.post.value && count >= 0) {
		$.postContainer.add($.loading.getView());
		Status.create({
			message:$.post.value,
			photo:currentBlob
		}, function(e) {
			$.postContainer.remove($.loading.getView());
			if (e.success) {
				ui.alert('updateSuccessTitle', 'updateSuccessText');
				$.trigger('success');
				Ti.App.fireEvent('app:status.update');
			}
			else {
				ui.alert('updateErrorTitle', 'updateErrorText');
			}
		});
	}
});

//Handle image attachment
$.camera.on('click', function() {
	var od = Ti.UI.createOptionDialog({
		options:[L('photoGallery'), L('camera'), L('cancel')],
		cancel:2,
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

$.deleteButton.on('click', function() {
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
		});
	});
});

//Reset UI for next post
$.reset = function() {
	$.post.value = '';
	count = 140;
	$.characters.text = count;
};

