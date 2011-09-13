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

  Codestrong.ui.createMapWindow = function() {
    var mapWindow = Titanium.UI.createWindow({
      id: 'mapWindow',
      title: 'Meeting Room Maps',
      backgroundColor: '#FFF',
      barColor: '#414444',
      height:'100%',
      fullscreen: false
    });

    // create table view data object
    var duration = 250;
    var data = [
      {
      	title: 'Floor 3 - Grand Ballroom', 
      	shortTitle:'3rd Floor', 
      	url: 'pages/maps/map3.html',
      	animateOut: {left:-1 * Ti.Platform.displayCaps.platformWidth, top: Codestrong.tabBarHeight, duration:duration},
      	animateIn: {left:0, top: Codestrong.tabBarHeight, duration:duration},
      	left: 0
      },
      {
      	title: 'Floor 4 - Pacific Terrace', 
      	shortTitle:'4th Floor', 
      	url: 'pages/maps/map4.html',
      	animateOut: {left:Ti.Platform.displayCaps.platformWidth, top: Codestrong.tabBarHeight, duration:duration},
      	animateIn: {left:0, top:Codestrong.tabBarHeight, duration:duration},
      	left: Ti.Platform.displayCaps.platformWidth
      }
    ];
    
    var tabbedBarView = Ti.UI.createView({
    	backgroundColor:'#555',
    	top:0,
    	height:Codestrong.tabBarHeight
    });
    var tabbedBar = Ti.UI.createView({
    	top:0,
    	backgroundColor: '#000',
    	height:Codestrong.tabBarHeight,
    	width:Ti.Platform.displayCaps.platformWidth
    });
    
    for (var i = 0; i < data.length; i++) {
    	var myEntry = data[i];
    	
    	myEntry.webview = Ti.UI.createWebView({
    		scalesPageToFit: true,
    		url: myEntry.url,
    		top:Codestrong.tabBarHeight,
    		bottom:0,
    		left:myEntry.left,
    		width:Ti.Platform.displayCaps.platformWidth
    	});
    	
    	var tabView = Ti.UI.createView({
			backgroundImage: (i == 0) ? 'images/buttonbar/button2_selected.png' : 'images/buttonbar/button2_unselected_shadowL.png',
			height:Codestrong.tabBarHeight,
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
				if (e.source.index == 0) {
					data[0].webview.animate(data[0].animateIn);	
					data[1].webview.animate(data[1].animateOut);	
				} else {
					data[0].webview.animate(data[0].animateOut);	
					data[1].webview.animate(data[1].animateIn);
				}
			}
		});
		
		tabView.add(tabLabel);
        tabbedBar.add(tabView);
        myEntry.tabView = tabView;	
    }

	tabbedBarView.add(tabbedBar);	
	mapWindow.add(tabbedBarView);
	mapWindow.add(data[0].webview);
	mapWindow.add(data[1].webview);
    
    return mapWindow;
  };

})();
