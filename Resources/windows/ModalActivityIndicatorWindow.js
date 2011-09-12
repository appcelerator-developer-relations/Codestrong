DrupalCon.ui.activityIndicator = (function() {
	var activityIndicator;
	var isShowing = false;
	var myTimeout = undefined;
	
	if (isAndroid()) {
		activityIndicator = Ti.UI.createActivityIndicator({
  			color:'#fff'
  		});	
	} else {
		var activityIndicator = Ti.UI.createWindow({
			modal:false,
			navBarHidden:true,
			touchEnabled:true
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
	
	activityIndicator.showModal = function(message, timeout, timeoutMessage) {
		if (isShowing) {
			return;	
		}
		isShowing = true;
		if (isAndroid()) {
			activityIndicator.message = message;
			activityIndicator.show();			
		} else {
			activityIndicator.ai.message = message;
			activityIndicator.ai.show();
			activityIndicator.open({animated:false});
		}	
		
		if (timeout) {
			myTimeout = setTimeout(function() {
				activityIndicator.hideModal();	
				if (timeoutMessage) {
					alert(timeoutMessage);	
				}
			}, timeout);	
		}
	};
	
	activityIndicator.hideModal = function() {
		if (myTimeout !== undefined) {
			clearTimeout(myTimeout);
			myTimeout = undefined;
		}
		if (isShowing) {
			isShowing = false;
			if (isAndroid()) {
				activityIndicator.hide();	
			} else {
				activityIndicator.ai.hide();
				activityIndicator.close({animated:false});	
			}	
		}
	}
	
	return activityIndicator;
})();