var menu = {
	data: [],
	init: function(params) {

			var activity = params.win.activity; 
	        activity.onCreateOptionsMenu = function (e) {
	          var optionsmenu = e.menu;
	          for (k = 0; k < params.buttons.length; k++) {
	          	Ti.API.debug(params.buttons[k].title);
	            menu.data[k] = optionsmenu.add({
	              title: params.buttons[k].title
	            });
	            menu.data[k].addEventListener("click", params.buttons[k].clickevent);
	          }
	        };

	}
};
