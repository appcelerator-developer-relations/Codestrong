//Tablet header emits navigation events
if (Alloy.isTablet) {
	var tabOffset = 121,
		tabWidth = 60;
		
	var navOffsets = {
		home:0,
		agenda: tabWidth,
		stream: tabWidth*2,
		venue: tabWidth*3,
		about: tabWidth*4
	};
	
	function doTab(name,noEvent) {
		//Loop through tabs and set active/inactive
		_.each(['home', 'agenda', 'stream', 'venue', 'about'], function(item) {
			if (name === item) {
				$[item+'Icon'].image = '/img/header/btn-tablet-'+item+'-pressed.png'
			}
			else {
				$[item+'Icon'].image = '/img/header/btn-tablet-'+item+'-default.png'
			}
		});
		
		noEvent || ($.trigger('change',{
			name:name
		}));
	}
	
	$.home.on('click', function() {
		doTab('home');
	});
	
	$.agenda.on('click', function() {
		doTab('agenda');
	});
	
	$.stream.on('click', function() {
		doTab('stream');
	});
	
	$.venue.on('click', function() {
		doTab('venue');
	});
	
	//post is special, just fire event
	$.post.on('click', function() {
		$.trigger('change', {
			name:'post'
		});
	});
	
	//Public API to manually set the tablet nav position
	$.setNav = function(name) {
		doTab(name,true);
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
			$.aboutSmallIcon.animate({
				opacity:0,
				duration:250
			});
			$.back.enabled = true;
			$.about.enabled = false;
			$.about.visible = false;
			$.profile.visible = false;
			$.profile.enabled = false;
		}
		else {
			$.backImage.animate({
				opacity:0,
				duration:250
			});
			$.aboutSmallIcon.animate({
				opacity:1,
				duration:250
			});
			$.back.enabled = false;
			$.about.enabled = true;
			$.about.visible = true;
			$.profile.visible = true;
			$.profile.enabled = true;
		}
	}
};

//Back isn't there on tablet
if ($.back) {
	$.back.on('click', function() {
		if ($.back.enabled) {
			$.trigger('back');
		}
	});
}

Ti.App.addEventListener('app:close.drawer', function(e) {
	//Right now we only go one level deep with the drawer on handheld
	if (e.controller === 'profile' || !Alloy.isTablet) {
		$.profile.animate({
			opacity:1,
			duration:250
		});
		$.profile.enabled = true;
		$.profile.visible = true;
	}
	
	if (e.controller === 'about' || !Alloy.isTablet) {
		$.about.animate({
			opacity:1,
			duration:250
		});
		$.about.enabled = true;
		$.about.visible = true;
	}
});

function doProfile() {
	if ($.profile.enabled) {
		Ti.App.fireEvent('app:open.drawer', {
			controller:'profile'
		});
		$.profile.animate({
			opacity:0,
			duration:250
		});
		$.profile.enabled = false;
		$.profile.visible = false;
		
		if (!Alloy.isTablet) {
			$.about.animate({
				opacity:0,
				duration:250
			});
			$.about.enabled = false;
			$.about.visible = false;
		}
	}
}
$.profile.on('click', doProfile);

function doAbout() {
	if ($.about.enabled) {
		Ti.App.fireEvent('app:open.drawer', {
			controller:'about'
		});
		if (!Alloy.isTablet) {
			$.profile.animate({
				opacity:0,
				duration:250
			});
			$.profile.enabled = false;
			$.profile.visible = false;
		}
		
		$.about.animate({
			opacity:0,
			duration:250
		});
		$.about.enabled = false;
		$.about.visible = false;
	}
}
$.about.on('click', doAbout);

