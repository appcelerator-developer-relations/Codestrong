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
}

