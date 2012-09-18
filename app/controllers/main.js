//controller instance variables
var drawers = [],
	sections = {
		home: Alloy.createController('home') //will dynamically populate with others as requested
	},
	currentSection;

//Initialize to home section
currentSection = sections.home;
$.content.add(currentSection.getView());

//Listen for new drawer events
Ti.App.addEventListener('app:open.drawer', function(e) {
	var d = Alloy.createController('drawer');
	drawers.push(d);
	$.container.add(d.getView());
	
	//Tablet manages this manually
	if (!Alloy.isTablet) {
		//add to the count managed by the header
		$.header.setBackVisible(true);
	}
	
	//Open a new drawer, containing the given view controller
	d.openDrawer(e.controller);
});

$.header.on('back', function() {
	var d = drawers.pop();
	d.closeDrawer(function() {
		$.container.remove(d.getView());
	});
	$.header.setBackVisible(drawers.length > 0);
});

//Manage section navigation from either tabs or header
function sectionNav(e) {
	if (e.name === 'post') {
		
	}
	else {
		sections[e.name] || (sections[e.name] = Alloy.createController(e.name));
		var oldSection = currentSection;
		currentSection = sections[e.name];
		currentSection.getView().opacity = 0;
		$.content.add(currentSection.getView());
		currentSection.getView().animate({
			opacity:1,
			duration:250
		}, function() {
			$.content.remove(oldSection.getView());
		});
	}
}
$.tabs && ($.tabs.on('change', sectionNav));
$.header.on('change', sectionNav);

//Initialize component and UI state
$.init = function() {
	//fire off initial UI animations
	$.container.animate({
		opacity:1,
		duration:250
	}, function() {
		$.header.getView().animate({
			top:0,
			duration:250
		});
		
		if (!Alloy.isTablet) {
			$.tabs.getView().animate({
				bottom:0,
				duration:250
			});
		}
	});
};
