var ui = require('ui'),
	Status = require('Status');
	
$.loading = Alloy.createController('loading');
$.index.add($.loading.getView());

function loadRows() {
	if (OS_ANDROID) {
		$.table.setData([
			{title:L('loadingLatest'), color:'#000'}
		]);
	}
	Status.query(function(e) {
		$.loading.stop();
		$.index.remove($.loading.getView());
		if (e.success) {
			var td = [];
			for (var i = 0, l = e.statuses.length; i<l; i++) {
				var status = e.statuses[i];
				if (status.photo && !status.photo.processed) continue;
				td.push(new ui.StatusRow(status));
			}
			$.table.setData(td);
		}
		else {
			ui.alert('networkGenericErrorTitle', 'activityStreamError');
		}
	},30);
}

function startRefresh() {
	$.index.add($.loading.getView());
	$.loading.start();
	loadRows();
}

//Listen for status update, and refresh.
Ti.App.addEventListener('app:status.update', startRefresh);

//Fire manually when this view receives "focus"
$.on('focus', startRefresh);

//Refresh when requested
$.refresh.addEventListener('click', startRefresh);

//Show a detail view for rows with an image
$.table.addEventListener('click', function(e) {
	var statusObject;
	
	if (OS_IOS) {
		statusObject = e.rowData.statusObject;
	}
	else {
		//On android we have no row data, so we have to dig for it a bit - holy crap is this ridiculous, we'll fix this
		if (e.source.statusObject) {
			statusObject = e.source.statusObject;
		}
		else if (e.source.parent.statusObject) {
			statusObject = e.source.parent.statusObject;
		}
		else if (e.source.parent.parent && e.source.parent.parent.statusObject) {
			statusObject = e.source.parent.parent.statusObject;
		}
		else if (e.source.parent.parent.parent && e.source.parent.parent.parent.statusObject) {
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
		
		if (OS_ANDROID) {
			Ti.UI.createNotification({
				message:L('pinch'),
				duration:Ti.UI.NOTIFICATION_DURATION_LONG
			}).show();
		}
	}
});
