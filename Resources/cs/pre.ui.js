(function() {
	
	
	if (Codestrong.isLargeScreen()) {
		Codestrong.settings = {
			mainBG: 'images/home_ipad.png',
			dashboardHeight: 340,
			dashboardWidth: 612,
			sponsorsPage:'pages/sponsors_ipad.html'
		};
	} else {
		Codestrong.settings = {
			mainBG: 'images/home.png',
			dashboardHeight: 170,
			dashboardWidth: 306,
			sponsorsPage:'pages/sponsors.html'
		};
	}
	
	// TODO: backgroundSelectedColor vs selectedBackgroundColor
	if (Codestrong.isAndroid()) {
		Codestrong.backgroundSelectedProperty = 'backgroundSelected';
	} else {
		Codestrong.backgroundSelectedProperty = 'selectedBackground';
	}
	
	Codestrong.createHeaderRow = function(title) {
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
})();