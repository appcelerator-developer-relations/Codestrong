(function() {
	var iconHeight = 85;
	var iconWidth = 102;
	var imageSuffix = '';
	
	if (Codestrong.isLargeScreen()) {
		iconHeight = 170;
		iconWidth = 204;
		imageSuffix = '@2x';
	} 
	
	// configure dashboard icons
	Codestrong.settings.icons = {
		height: iconHeight,
		width: iconWidth,
		list: [
			{
				image: 'images/dashboard/schedule' + imageSuffix + '.png',
				func: DrupalCon.ui.createDayWindow,
				refresh: true
			},
			{
				image: 'images/dashboard/maps' + imageSuffix + '.png',
				func: DrupalCon.ui.createMapWindow
			},
			{
				image: 'images/dashboard/news' + imageSuffix + '.png',
				func: DrupalCon.ui.createTwitterWindow
			},
			{
				image: 'images/dashboard/speakers' + imageSuffix + '.png',
				func: DrupalCon.ui.createPresentersWindow,
				refresh: true
			},
			{
				image: 'images/dashboard/sponsors' + imageSuffix + '.png',
				func: DrupalCon.ui.createHtmlWindow,
				args: {url: Codestrong.settings.sponsorsPage, title:'Sponsors'}
			},
		    {
				image: 'images/dashboard/about' + imageSuffix + '.png',
				func: DrupalCon.ui.createAboutWindow
			}	
		]
	};	
})();