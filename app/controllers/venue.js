var ui = require('ui');

//Create handheld UI and controls
if (!Alloy.isTablet) {
	$.headerView = new ui.HeaderView({
		title:'venueCaps',
		optionWidth:100,
		options:['thirdFloor', 'fourthFloor']
	});
	$.headerViewContainer.add($.headerView);
	
	$.headerView.on('change', function(e) {
		if (e.selection === 'thirdFloor') {
			$.venue.image = '/img/venue/venue-3rd-floor.png';
		}
		else {
			$.venue.image = '/img/venue/venue-4th-floor.png';
		}
	});
	
	//reset to day one if need be, since Android will not retain animation positions when a view has been unloaded from the hierarchy
	$.on('focus', function() {
		$.venue.image = '/img/venue/venue-3rd-floor.png';
		$.headerView.goTo(0);
	});
}
