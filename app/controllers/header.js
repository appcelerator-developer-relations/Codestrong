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
	
	$.home.addEventListener('click', function() {
		doTab('home');
	});
	
	$.agenda.addEventListener('click', function() {
		doTab('agenda');
	});
	
	$.stream.addEventListener('click', function() {
		doTab('stream');
	});
	
	$.venue.addEventListener('click', function() {
		doTab('venue');
	});
	
	//post is special, just fire event
	$.post.addEventListener('click', function() {
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
			$.back.enabled = true;
			$.back.visible = true;
			$.about.enabled = false;
			$.about.visible = false;
			$.profile.visible = false;
			$.profile.enabled = false;
		}
		else {
			$.back.enabled = false;
			$.back.visible = false;
			$.about.enabled = true;
			$.about.visible = true;
			$.profile.visible = true;
			$.profile.enabled = true;
		}
	}
};

//Back isn't there on tablet
if ($.back) {
	$.back.addEventListener('click', function() {
		if ($.back.enabled) {
			$.trigger('back');
		}
	});
}

function profileOn() {
	$.profile.enabled = true;
	$.profile.visible = true;
}

function aboutOn() {
	$.about.enabled = true;
	$.about.visible = true;
}

Ti.App.addEventListener('app:close.drawer', function(e) {
	//Right now we only go one level deep with the drawer on handheld
	if (e.controller === 'profile' || !Alloy.isTablet) {
		profileOn();
	}
	
	else if (e.controller === 'about' || !Alloy.isTablet) {
		aboutOn();
	}
	
	//On all others, assume we need to re-enable both
	else {
		profileOn();
		aboutOn();
	}
});

function doProfile() {
	if ($.profile.enabled) {
		Ti.App.fireEvent('app:open.drawer', {
			controller:'profile'
		});
		$.profile.enabled = false;
		$.profile.visible = false;
		
		if (!Alloy.isTablet) {
			$.about.enabled = false;
			$.about.visible = false;
		}
	}
}
$.profile.addEventListener('click', doProfile);

function doAbout() {
	if ($.about.enabled) {
		Ti.App.fireEvent('app:open.drawer', {
			controller:'about'
		});
		if (!Alloy.isTablet) {
			$.profile.enabled = false;
			$.profile.visible = false;
		}
		
		$.about.enabled = false;
		$.about.visible = false;
	}
}
$.about.addEventListener('click', doAbout);

