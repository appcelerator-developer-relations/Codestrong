/**
 * This file is part of DrupalCon Mobile.
 *
 * DrupalCon Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DrupalCon Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DrupalCon Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {

  var uiEnabled = true;

  DrupalCon.ui.createMapWindow = function(tabGroup) {
    var mapWindow = Titanium.UI.createWindow({
      id: 'mapWindow',
      title: 'Meeting Room Maps',
      backgroundColor: '#FFF',
      barColor: '#414444',
      tabGroup: tabGroup
    });

    // create table view data object
    var data = [
      {
      	title: 'Floor 3 - Grand Ballroom', 
      	shortTitle:'Grand Ballroom', 
      	image: isIpad() ? 'images/maps/3rd_floor_ipad.png' : 'images/maps/3rd_floor_iphone.png'
      },
      {
      	title: 'Floor 4 - Pacific Terrace', 
      	shortTitle:'Pacific Terrace', 
      	image: isIpad() ? 'images/maps/4th_floor_ipad.png' : 'images/maps/4th_floor_iphone.png'
      }
      // ,
      // {
      	// title: 'Floor 5 - Intercontinental Ballroom', 
      	// shortTitle:'Intercontinental', 
      	// image:'images/maps/5th.png'
      // }
    ];
    
    var tabbedBarView = Ti.UI.createView({
    	backgroundColor:'#880000',
    	borderColor: '#000',
    	borderWidth: 1,
    	top:0,
    	height:36
    });
    var tabbedBar = Ti.UI.createView({
    	height:36,
    	width:204,
    	layout:'horizontal'
    });
    
    for (var i = 0; i < data.length; i++) {
    	var myEntry = data[i];
    	
    	myEntry.webview = Ti.UI.createWebView({
    		scalesPageToFit: true,
    		html: '<html><head></head><body style="background-color: #fff;" class="maps">' +
      			'  <meta name="viewport" content="target-densityDpi=device-dpi, user-scalable=yes, width=device-width, initial-scale = .25, minimum-scale = .25, maximum-scale = 4.0" />' +
      			'  <meta name="apple-mobile-web-app-capable" content="yes" />' +
      			'<img src="' + myEntry.image + '" style="height:100%;"/>' +
      			'</body></html>'
    	});
    	
    	var tabView = Ti.UI.createView({
			top:3,
			backgroundColor: (i == 0) ? '#666' : '#222',
			borderRadius:8,
			borderColor:'#000',
			borderWidth: isAndroid() ? 1 : 2,
			height:30,
			width: 100,
			index: i
		});
		var tabLabel = Ti.UI.createLabel({
			text: myEntry.shortTitle,
			textAlign:'center',
			color: '#fff',
			height:'auto',
			width:'100%',
			touchEnabled: false,
			font: {
				fontSize:12	
			}
		});
		tabView.addEventListener('click', function(e) {
			for (var j = 0; j < data.length; j++) {
				data[j].tabView.backgroundColor = '#222';
				if (e.source.index == j) {
					scrollable.scrollToView(data[j].webview);
				}
			}
			e.source.backgroundColor = '#666';
		});
		
		tabView.add(tabLabel);
		if (i != 0) {
			tabbedBar.add(Ti.UI.createView({width:3}));
		}
        tabbedBar.add(tabView);
        myEntry.tabView = tabView;	
    }
    
    var scrollable = Ti.UI.createScrollableView({
		showPagingControl: true,
		backgroundColor: '#000000',
		top:30,
		views:[
			data[0].webview,
			data[1].webview
			//data[2].webview
		]
	});
	scrollable.addEventListener('scroll', function(e) {
		if (e.view) {
			data[e.currentPage].tabView.fireEvent('click');
		}
	});
	
	if (!isAndroid()) {
		Titanium.Gesture.addEventListener('orientationchange', function(e){   
	    	scrollable.scrollToView(scrollable.currentPage);   
		});
	}
	
	mapWindow.add(scrollable);
	tabbedBarView.add(tabbedBar);	
	mapWindow.add(tabbedBarView);
    
    return mapWindow;
  };

})();
