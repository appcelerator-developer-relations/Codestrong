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
      height:'100%'
    });

    // create table view data object
    var data = [
      {
      	title: 'Floor 3 - Grand Ballroom', 
      	shortTitle:'Floor 3 - Grand Ballroom', 
      	url: 'pages/maps/map3.html'
      },
      {
      	title: 'Floor 4 - Pacific Terrace', 
      	shortTitle:'Floor 4 - Pacific Terrace', 
      	url: 'pages/maps/map4.html'
      }
    ];
    
    var tabbedBarView = Ti.UI.createView({
    	backgroundColor:'#CE3016',
    	borderColor: '#000',
    	borderWidth: 1,
    	top:0,
    	height:36
    });
    var tabbedBar = Ti.UI.createView({
    	height:36,
    	width:304,
    	layout:'horizontal'
    });
    
    for (var i = 0; i < data.length; i++) {
    	var myEntry = data[i];
    	
    	myEntry.webview = Ti.UI.createWebView({
    		scalesPageToFit: true,
    		url: myEntry.url,
    		height:'100%'
    	});
    	
    	var tabView = Ti.UI.createView({
			top:3,
			backgroundImage: (i == 0) ? 'images/BUTT_drk_on.png' : 'images/BUTT_drk_off.png',
			borderRadius:8,
			borderColor:'#000',
			height:30,
			width: 150,
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
				data[j].tabView.backgroundImage = 'images/BUTT_drk_off.png';
				if (e.source.index == j) {
					scrollable.scrollToView(data[j].webview);
				}
			}
			e.source.backgroundImage = 'images/BUTT_drk_on.png';
		});
		
		tabView.add(tabLabel);
		if (i != 0) {
			tabbedBar.add(Ti.UI.createView({width:3}));
		}
        tabbedBar.add(tabView);
        myEntry.tabView = tabView;	
    }

    var scrollable = Ti.UI.createScrollableView({
		showPagingControl: false,
		backgroundColor: '#0000ff',
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
