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

  DrupalCon.ui.createMapWindow = function() {
    var mapWindow = Titanium.UI.createWindow({
      id: 'mapWindow',
      title: 'Meeting Room Maps',
      backgroundColor: '#FFF',
      barColor: '#414444',
      height:'100%',
      fullscreen: false
    });

    // create table view data object
    var data = [
      {
      	title: 'Floor 3 - Grand Ballroom', 
      	shortTitle:'3rd Floor', 
      	url: 'pages/maps/map3.html'
      },
      {
      	title: 'Floor 4 - Pacific Terrace', 
      	shortTitle:'4th Floor', 
      	url: 'pages/maps/map4.html'
      }
    ];
    
    var tabbedBarView = Ti.UI.createView({
    	backgroundColor:'#555',
    	top:0,
    	height:36
    });
    var tabbedBar = Ti.UI.createView({
    	top:0,
    	backgroundColor: '#000',
    	height:36,
    	width:Ti.Platform.displayCaps.platformWidth
    });
    
    for (var i = 0; i < data.length; i++) {
    	var myEntry = data[i];
    	
    	myEntry.webview = Ti.UI.createWebView({
    		scalesPageToFit: true,
    		url: myEntry.url,
    		height:'100%'
    	});
    	
    	var tabView = Ti.UI.createView({
			backgroundImage: (i == 0) ? 'images/buttonbar/button2_selected.png' : 'images/buttonbar/button2_unselected_shadowL.png',
			height:36,
			left: i * (Ti.Platform.displayCaps.platformWidth/data.length),
			right: Ti.Platform.displayCaps.platformWidth - ((parseInt(i) + 1) * (Ti.Platform.displayCaps.platformWidth/data.length)),
			index: i
		});
		
		var tabLabel = Ti.UI.createLabel({
			text: myEntry.shortTitle,
			textAlign:'center',
			color: '#fff',
			height:'auto',
			touchEnabled: false,
			font: {
				fontSize:14,
				fontWeight: 'bold'
			}
		});
		tabView.addEventListener('click', function(e) {
			if (e.source.index == 0) {
				data[0].tabView.backgroundImage = 'images/buttonbar/button2_selected.png';
				data[1].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowL.png';
			} else if (e.source.index == 1) {
				data[0].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowR.png';
				data[1].tabView.backgroundImage = 'images/buttonbar/button2_selected.png';
			} 
			
			for (var j = 0; j < data.length; j++) {
				if (e.source.index == j) {
					scrollable.scrollToView(data[j].webview);
				}
			}
		});
		
		tabView.add(tabLabel);
        tabbedBar.add(tabView);
        myEntry.tabView = tabView;	
    }

    var scrollable = Ti.UI.createScrollableView({
		showPagingControl: false,
		top:36,
		bottom:0,
		left:0,
		right:0,
		views:[
			data[0].webview,
			data[1].webview
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
