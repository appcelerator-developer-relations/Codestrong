(function() {
	if (Codestrong.isLargeScreen()) {
		Codestrong.ui = {
			mainBackgroundImage: 'images/home_ipad.png',
			dashboardHeight: 340,
			dashboardWidth: 612,
			sponsorsPage:'pages/sponsors_ipad.html'
		};
	} else {
		Codestrong.ui = {
			mainBackgroundImage: 'images/home.png',
			dashboardHeight: 170,
			dashboardWidth: 306,
			sponsorsPage:'pages/sponsors.html'
		};
	}
	
	if (Codestrong.isAndroid()) {
		Codestrong.ui.backgroundSelectedProperty = 'backgroundSelected';
	} else {
		Codestrong.ui.backgroundSelectedProperty = 'selectedBackground';
	}
	
	Codestrong.extend(Codestrong.ui, {
		backgroundSelectedColor: '#999',
		tabBarHeight: 36
	});
	
	Codestrong.ui.createHeaderRow = function(title) {
		var headerRow = Ti.UI.createTableViewRow({
	    	classname: 'header_row',
	    	height:26,
	    	backgroundImage: 'pages/timebreak_gray@2x.png',
	    	selectedBackgroundImage:'pages/timebreak_gray@2x.png',
	    	touchEnabled: false
	    });
	    var headerLabel = Ti.UI.createLabel({
	    	text: title,
	    	color: '#fff',
	    	font: {
	    		fontSize:16,
	    		fontWeight:'bold'	
	    	},
	    	left: 10,
	    	touchEnabled: false
	    });
	    headerRow.add(headerLabel);
	    
	    return headerRow;
	};
	
	Codestrong.ui.createTabbedScrollableView = function(params) {
		// Set configuration variables and defaults is necessary
		var data = params.data || [];
		var tabBarHeight = params.tabBarHeight || 36;
		var width = params.width || Ti.Platform.displayCaps.platformWidth;
		var images = {
			selected: 'images/buttonbar/button2_selected.png',
			unselected: 'images/buttonbar/button2_unselected_shadow.png',
			unselectedLS: 'images/buttonbar/button2_unselected_shadowL.png',
			unselectedRS: 'images/buttonbar/button2_unselected_shadowR.png',
		};
		var font = params.font || {fontSize: 14, fontWeight: 'bold'};
		var item, backgroundImage, tabView, tabLabel, scrollable, i;
		
		// Start creating the TabbedScrollableView
		var container = Ti.UI.createView();
		var tabbedBarView = Ti.UI.createView({
			top: 0,
            backgroundColor: params.backgroundColor || '#555',
            height: tabBarHeight
        });
        var tabbedBar = Ti.UI.createView({
            top: 0,
            backgroundColor: '#000',
            height: tabBarHeight,
            width: width
        });
        
        for (i = 0; i < data.length; i++) {
        	item = data[i];

        	// set the default state of the tab bar images
        	if (i == 0) {
        		backgroundImage = images.selected;
        	} else if (i == 1) {
        		backgroundImage = images.unselectedLS;
        	} else {
        		backgroundImage = images.unselected;
        	}
        	
        	// create each tab bar button
            tabView = Ti.UI.createView({
                backgroundImage: backgroundImage,
                height: tabBarHeight,
                left: i * (width / data.length),
                right: width - ((parseInt(i) + 1) * (width / data.length)),
                index: i
            });
            tabLabel = Ti.UI.createLabel({
                text: item.title,
                textAlign: 'center',
                color: '#fff',
                height: 'auto',
                touchEnabled: false,
                font: font
            });

			// adjust images and scroll ScrollableView on tab bar clicks
            tabView.addEventListener('click', function (e) {
            	var index = e.source.index;
            	for (var j = 0; j < data.length; j++) {
            		if (index == j) {
            			data[j].tabView.backgroundImage = images.selected;
            		} else if (index-1 == j && data[index-1]) {
            			data[j].tabView.backgroundImage = images.unselectedRS;
            		} else if (index+1 == j && data[index+1]) {
            			data[j].tabView.backgroundImage = images.unselectedLS;
            		} else {
            			data[j].tabView.backgroundImage = images.unselected;
            		}	
            	}

				scrollable.scrollToView(data[index].view);
            });

			// layout the tabbed scrollableview
            tabView.add(tabLabel);
            tabbedBar.add(tabView);
            item.tabView = tabView;
        }
        
        scrollable = Ti.UI.createScrollableView({
            showPagingControl: false,
            backgroundColor: '#000000',
            top: tabBarHeight,
            views: (function() {
            	var views = [];
            	for (var j = 0; j < data.length; j++) {
            		views.push(data[j].view);	
            	}
            	return views;
            })()
        });
        scrollable.addEventListener('scroll', function (e) {
            if (e.view) {
                data[e.currentPage].tabView.fireEvent('click');
            }
        });
        
        container.add(scrollable);
        tabbedBarView.add(tabbedBar);
        container.add(tabbedBarView);

        return container;
	};
})();