var ui = require('ui'),
	Status = require('Status');
	
$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

function loadRows() {
	Status.query(function(e) {
		$.index.remove($.loading.getView());
		if (e.success) {
			var td = [];
			for (var i = 0, l = e.statuses.length; i<l; i++) {
				var status = e.statuses[i];
				td.push(new ui.StatusRow(status));
			}
			$.table.setData(td);
		}
		else {
			ui.alert('networkGenericErrorTitle', 'activityStreamError');
		}
	});
}

//Listen for status update, and refresh.
Ti.App.addEventListener('app:status.update', function(e) {
	if (e.withPhoto && Ti.Platform.osname === 'android') {
		//swallow this for now - if we try to assign a URL to an image view we crash, so avoid doing it for now
	}
	else {
		loadRows();
	}
});

//Fire manually when this view receives "focus"
$.on('focus', loadRows);

//Show a detail view for rows with an image
$.table.on('click', function(e) {
	var statusObject;
	
	if (OS_IOS) {
		statusObject = e.rowData.statusObject;
	}
	else {
		//On android we have no row data, so we have to dig for it a bit - holy crap is this ridiculous, we'll fix this
		if (e.source.statusObject) {
			statusObject = e.source.statusObject;
		}
		else if (e.source.parent.sessionObject) {
			statusObject = e.source.parent.statusObject;
		}
		else if (e.source.parent.parent && e.source.parent.parent.sessionObject) {
			statusObject = e.source.parent.parent.statusObject;
		}
		else if (e.source.parent.parent.parent && e.source.parent.parent.parent.sessionObject) {
			statusObject = e.source.parent.parent.parent.statusObject;
		}
	}
	
	if (statusObject.photo) {
		var w = Ti.UI.createView({
			top:'5dp',
			left:'5dp',
			right:'5dp',
			bottom:'5dp'
		});
		
		var close = Ti.UI.createImageView({
			image:'/img/post/close.png',
			top:0,
			left:0,
			zIndex:999
		});
		w.add(close);
		
		var container = Ti.UI.createView({
			backgroundColor:'#000',
			top:'10dp',
			left:'10dp',
			right:'10dp',
			bottom:'10dp'
		});
		w.add(container);
		
		if (OS_IOS) {
			var scroll = Ti.UI.createScrollView({
				contentHeight:'auto',
				contentWidth:'auto',
				maxZoomScale:5,
				minZoomScale:0.75
			});
			scroll.add(Ti.UI.createImageView({
				image:statusObject.photo.urls.medium_640
			}));
			container.add(scroll);
		}
		else {
			var web = Ti.UI.createWebView({
				backgroundColor:'#000',
				html:'<html style="width:1024px;height:1024px;"><body style="background-color:#000;width:1024px;;height:1024px;"><img src="'+ statusObject.photo.urls.medium_640 +'"/></body></html>',
				scalesPageToFit:true
			});
			container.add(web);
		}
		
		$.index.parent.parent.add(w);
		
		close.addEventListener('click', function() {
			$.index.parent.parent.remove(w);
			//force GC on constituent elements
			w = null;
			container = null;
			web = null;
			close = null;
		});
	}
});
