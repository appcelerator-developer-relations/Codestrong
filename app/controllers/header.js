//Tablet header emits navigation events
if (Alloy.isTablet) {
	var tabOffset = 26,
		tabWidth = 60;
		
	var navOffsets = {
		home:0,
		agenda: tabWidth,
		stream: tabWidth*2,
		venue: tabWidth*3
	};
	
	function doTab(name,offset,noEvent) {
		$.navIndicator.animate({
			left:offset+tabOffset,
			duration:250
		});
		
		noEvent || ($.trigger('change',{
			name:name
		}));
	}
	
	$.home.on('click', function() {
		doTab('home', navOffsets.home);
	});
	
	$.agenda.on('click', function() {
		doTab('agenda', navOffsets.agenda);
	});
	
	//post is special, just fire event
	$.post.on('click', function() {
		$.trigger('change', {
			name:'post'
		});
	});
	
	$.stream.on('click', function() {
		doTab('stream', navOffsets.stream);
	});
	
	$.venue.on('click', function() {
		doTab('venue', navOffsets.venue);
	});
	
	//Public API to manually set the tablet nav position
	$.setNav = function(name) {
		doTab(name,navOffsets[name],true);
	};
}

//Public component API
$.setBackVisible = function(toggle) {
	if (!Alloy.isTablet) {
		if (toggle) {
			$.backImage.animate({
				opacity:1,
				duration:250
			});
			$.back.enabled = true;
			$.profile.visible = false;
			$.profile.enabled = false;
		}
		else {
			$.backImage.animate({
				opacity:0,
				duration:250
			});
			$.back.enabled = false;
			$.profile.visible = true;
			$.profile.enabled = true;
		}
	}
};

//Back isn't there on tablet
if ($.back) {
	$.back.on('click', function goBack() {
		if ($.back.enabled) {
			$.trigger('back');
		}
	});
}

function doProfile() {
	if ($.profile.enabled) {
		Ti.App.fireEvent('app:open.drawer', {
			controller:'profile'
		});
	}
}
$.profile.on('click', doProfile);

