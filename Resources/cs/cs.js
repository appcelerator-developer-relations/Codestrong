var Codestrong = {
	android: {
		menu: {}	
	},
	datetime: {},
    ui: {},
    __isLargeScreen: undefined,
    __isAndroid: undefined,
    navWindow: undefined,
    navGroup: undefined,
    tabBarHeight: 36
};

(function() {
	Codestrong.create = function (o) {
	    var f = function () {};
	    f.prototype = o;
	    return new f();
	};
	
	Codestrong.extend = function(obj) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    for (var i = 0; i < args.length; i++) {
	    	var source = args[i];
	      	for (var prop in source) {
	        	if (source[prop] !== void 0) obj[prop] = source[prop];
	      	}
	    }
	    return obj;
	};
	
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
	
	Codestrong.cleanSpecialChars = function(str) {
  		if (str == null) {
    		return '';
  		}
  		if (typeof str === 'string') {
    		return  str
      			.replace(/&quot;/g,'"')
      			.replace(/\&amp\;/g,"&")
      			.replace(/&lt;/g,"<")
      			.replace(/&gt;/g,">")
      			.replace(/&#039;/g, "'");
  		}
  		return '';
	};
	
	Codestrong.android.menu = {
		data: [],
		init: function(params) {
			var activity = params.win.activity; 
	        activity.onCreateOptionsMenu = function (e) {
	          	var optionsmenu = e.menu;
	          	for (k = 0; k < params.buttons.length; k++) {
	            	Codestrong.android.menu.data[k] = optionsmenu.add({
	              		title: params.buttons[k].title
	            	});
	            	Codestrong.android.menu.data[k].addEventListener("click", params.buttons[k].clickevent);
	          	}
	        };
		}
	};
})();