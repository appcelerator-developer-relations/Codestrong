//Tabs are 20% of screen width for handheld
var tabWidth = Ti.Platform.displayCaps.platformWidth/5;

var tabPositions = {
	home:0,
	agenda:tabWidth,
	post:tabWidth*2,
	stream:tabWidth*3,
	venue:tabWidth*4
};

//set tab positions
$.home.left = tabPositions.home;
$.agenda.left = tabPositions.agenda;
$.post.left = tabPositions.post;
$.stream.left = tabPositions.stream;
$.venue.left = tabPositions.venue;

//add tab behavior
function doTab(name,offset,noEvent) {
	$.indicator.animate({
		left:offset,
		duration:250
	});
	
	noEvent || ($.trigger('change',{
		name:name
	}));
}

$.home.on('click', function() {
	doTab('home', tabPositions.home);
});

$.agenda.on('click', function() {
	doTab('agenda', tabPositions.agenda);
});

//post is special, just fire event
$.post.on('click', function() {
	$.trigger('change', {
		name:'post'
	});
});

$.stream.on('click', function() {
	doTab('stream', tabPositions.stream);
});

$.venue.on('click', function() {
	doTab('venue', tabPositions.venue);
});

//Public API to manually set navigation state
$.setTab = function(name) {
	doTab(name,tabPositions[name],true);
};


