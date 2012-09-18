//Tabs are 20% of screen width for handheld
var tabWidth = Ti.Platform.displayCaps.platformWidth/5;

//set tab positions
$.home.left = 0;
$.agenda.left = tabWidth;
$.post.left = tabWidth*2;
$.speakers.left = tabWidth*3;
$.venue.left = tabWidth*4;

//add tab behavior
function doTab(name,offset) {
	$.indicator.animate({
		left:offset,
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
	doTab('speakers', tabWidth*3);
});

$.venue.on('click', function() {
	doTab('venue', tabWidth*4);
});


