DrupalCon.ui.activityIndicator = (function() {
	var activityIndicator;
	if (isAndroid()) {
		activityIndicator = Ti.UI.createActivityIndicator({
  			color:'#fff'
  		});	
	} else {
		var activityIndicator = Ti.UI.createWindow({
			modal:false,
			navBarHidden:true
		});
		var view = Ti.UI.createView({
			backgroundColor: '#000',
			height: '100%',
			width: '100%',
			opacity: 0.65
		});
		var ai = Ti.UI.createActivityIndicator({
		  	style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		  	color:'#fff'
		});
		activityIndicator.ai = ai;
		activityIndicator.add(view);
		activityIndicator.add(ai);
	}
	
	activityIndicator.showModal = function(message) {
		if (isAndroid()) {
			activityIndicator.message = message;
			activityIndicator.show();			
		} else {
			activityIndicator.ai.message = message;
			activityIndicator.ai.show();
			activityIndicator.open({animated:false});
		}	
	};
	
	activityIndicator.hideModal = function() {
		if (isAndroid()) {
			activityIndicator.hide();	
		} else {
			activityIndicator.ai.hide();
			activityIndicator.close({animated:false});	
		}	
	}
	
	return activityIndicator;
})();