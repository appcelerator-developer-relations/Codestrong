Codestrong = {
	__isLargeScreenValue: undefined,
	settings: {},
	navWindow: Ti.UI.createWindow()
};

(function() {
	Codestrong.isLargeScreen = function() {
		if (Codestrong.__isLargeScreenValue === undefined) {
			Codestrong.__isLargeScreenValue	= (Ti.Platform.displayCaps.platformWidth >= 600);
		}
		return Codestrong.__isLargeScreenValue;
	};
	
	if (Codestrong.isLargeScreen()) {
		Codestrong.settings = {
			mainBG: 'images/home_ipad.png',
			dashboardHeight: 340,
			dashboardWidth: 612,
			iconHeight: 170,
			iconWidth: 204,
			icons: {
				schedule:'images/dashboard2/icon_schedule@2x.png',
				maps:'images/dashboard2/icon_maps@2x.png',
				news:'images/dashboard2/icon_news@2x.png',
				speakers:'images/dashboard2/icon_speakers@2x.png',
				sponsors:'images/dashboard2/icon_sponsors@2x.png',
				about:'images/dashboard2/icon_about@2x.png'	
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
				schedule:'images/dashboard2/icon_schedule.png',
				maps:'images/dashboard2/icon_maps.png',
				news:'images/dashboard2/icon_news.png',
				speakers:'images/dashboard2/icon_speakers.png',
				sponsors:'images/dashboard2/icon_sponsors.png',
				about:'images/dashboard2/icon_about.png'		
			},
			sponsorsPage:'pages/sponsors.html'
		};
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