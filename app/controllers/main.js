//controller instance variables
var drawers = [],
	sections = {
		home: Alloy.createController('home') //will dynamically populate with others as requested
	},
	currentSection;

//Initialize to home section
currentSection = sections.home;
$.content.add(currentSection.getView());
currentSection.trigger('focus');
currentSection.on('nav', sectionNav);

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
	d.openDrawer(e.controller, e.contextData);
	
	d.on('close', function() {
		Ti.App.fireEvent('app:close.drawer', {
			controller:e.controller
		});
	});
});

function popDrawer() {
	var d = drawers.pop();
	d.closeDrawer(function() {
		$.container.remove(d.getView());
	});
	$.header.setBackVisible(drawers.length > 0);
}

$.header.on('back', popDrawer);

//For tablet, set up a post view
var postViewShown = false;
if (Alloy.isTablet) {
	$.postView = Alloy.createController('postView');
	
	function dismissForm() {
		$.postView.hideForm(function() {
			$.postView.getView().animate({
				opacity:0,
				duration:250
			}, function() {
				$.container.remove($.postView.getView());
				postViewShown = false;
			});
		});
	}
	
	$.postView.on('blur', dismissForm);
	$.postView.on('success', dismissForm);
}

//Manage section navigation from either tabs or header
function sectionNav(e) {
	if (currentSection !== sections[e.name]) {
		if (e.name === 'post') {
			//for tablet, we'll do a view in the main view
			if (Alloy.isTablet) {
				if (!postViewShown) {
					$.content.add($.postView.getView());
					$.postView.getView().animate({
						opacity:1,
						duration:250
					}, function() {
						$.postView.showForm(function() {
							postViewShown = true;
						});
					});
				}
			}
			//for handheld, open a modal window which supports multiple orientations
			else {
				var w = Alloy.createController('postWindow');
				w.openWindow();
			}
		}
		else {
			//Make sure proper tab is set
			$.tabs && ($.tabs.setTab(e.name));
			Alloy.isTablet && ($.header.setNav(e.name));
			
			//Swap out the current main section of the application
			sections[e.name] || (sections[e.name] = Alloy.createController(e.name));
			var oldSection = currentSection;
			currentSection = sections[e.name];
			currentSection.on('nav', sectionNav);
			
			currentSection.getView().visible = false;
			$.content.add(currentSection.getView());
			//trigger focus event 
			currentSection.trigger('focus');
			currentSection.getView().visible = true;
			oldSection.getView().visible = false;
			$.content.remove(oldSection.getView());
			oldSection.off('nav', sectionNav);
		}
	}
}
$.tabs && ($.tabs.on('change', sectionNav));
$.header.on('change', sectionNav);

//Re-initialize after logout
Ti.App.addEventListener('app:logout', function() {
	while (drawers.length > 0) {
		popDrawer();
	}
	
	if (currentSection !== sections.home) {
		//Update current section
		sectionNav({
			name:'home'
		});
		
		//reset nav controls
		$.tabs && ($.tabs.setTab('home'));
		Alloy.isTablet && ($.header.setNav('home'));
	}
});

//Initialize component and UI state
$.init = function(ready) {
	//fire off initial UI animations
	$.container.animate({
		opacity:1,
		duration:250
	}, function() {
		//Disabling the header and tab animations for now, looks like booty on Android
		/*
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
		*/
	});
};
