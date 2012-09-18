//Tablet header emits navigation events
if (Alloy.isTablet) {
	var tabOffset = 26,
		tabWidth = 60;
	
	//add tab behavior - this could be factored out for reuse between handheld tabs + menu nav for tablet
	function doTab(name,offset) {
		$.navIndicator.animate({
			left:offset+tabOffset,
			duration:250
		});
		$.trigger('change',{
			name:name
		});
	}
	
	$.home.on('click', function() {
		doTab('home', 0);
	});
	
	$.agenda.on('click', function() {
		doTab('agenda', tabWidth);
	});
	
	//post is special, just fire event
	$.post.on('click', function() {
		$.trigger('change', {
			name:'post'
		});
	});
	
	$.speakers.on('click', function() {
		doTab('speakers', tabWidth*2);
	});
	
	$.venue.on('click', function() {
		doTab('venue', tabWidth*3);
	});
}

//Public component API
$.setBackVisible = function(toggle) {
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