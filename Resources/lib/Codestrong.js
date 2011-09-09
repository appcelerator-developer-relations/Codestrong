Codestrong = {
	__isLargeScreen: undefined,
	__isAndroid: undefined,
	settings: {},
	navWindow: undefined,
	navGroup: undefined
};

(function() {
	Codestrong.isLargeScreen = function() {
		if (Codestrong.__isLargeScreen === undefined) {
			Codestrong.__isLargeScreen = (Ti.Platform.displayCaps.platformWidth >= 600);
		}
		return Codestrong.__isLargeScreen;
	};
	
	Codestrong.isAndroid = function() {
		if (Codestrong.__isAndroid === undefined) {
			Codestrong.__isAndroid = (Ti.Platform.osname == 'android');
		}
		return Codestrong.__isAndroid;
	}
	
	if (Codestrong.isLargeScreen()) {
		Codestrong.settings = {
			mainBG: 'images/home_ipad.png',
			dashboardHeight: 340,
			dashboardWidth: 612,
			iconHeight: 170,
			iconWidth: 204,
			icons: {
				schedule:'images/dashboard/schedule@2x.png',
				maps:'images/dashboard/maps@2x.png',
				news:'images/dashboard/news@2x.png',
				speakers:'images/dashboard/speakers@2x.png',
				sponsors:'images/dashboard/sponsors@2x.png',
				about:'images/dashboard/about@2x.png'	
			},
			sponsorsPage:'pages/sponsors_ipad.html'
		};
	} else {
		Codestrong.settings = {
			mainBG: 'images/home.png',
			dashboardHeight: 170,
			dashboardWidth: 306,
			iconHeight: 85,
			iconWidth: 102,
			icons: {
				schedule:'images/dashboard/schedule.png',
				maps:'images/dashboard/maps.png',
				news:'images/dashboard/news.png',
				speakers:'images/dashboard/speakers.png',
				sponsors:'images/dashboard/sponsors.png',
				about:'images/dashboard/about.png'		
			},
			sponsorsPage:'pages/sponsors.html'
		};
	}
	
	// TODO: backgroundSelectedColor vs selectedBackgroundColor
	if (Codestrong.isAndroid()) {
		
	} else {
		
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