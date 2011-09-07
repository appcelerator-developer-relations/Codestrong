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

/*
  // Add a menu to all pages except news (which would be confusing).
  tabGroup.addEventListener('focus', function(e) {
    //dpm(e.index);
    if (e.index != 1 && e.index !=2 && e.index != 4){
      if (isAndroid()){
        // Android has a menu
        var buttons = [];
        buttons.push({
          title: "Update",
          clickevent: function () {
            Ti.fireEvent('drupalcon:update_data');
          }
        });
        menu.init({
          win: tabGroup.tabs[e.index].window,
          buttons: buttons
        });
      }
      else {
        
        // iOS should only have the button.
        var button = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.REFRESH
        });
        var win = tabGroup.tabs[e.index].window;
        win.rightNavButton = button;
        button.addEventListener('click', function() {
          Ti.fireEvent('drupalcon:update_data');
        });
      }
    }
  });
*/

  Drupal.navWindow = Ti.UI.createWindow();
  Drupal.navWindow.orientationModes = [Ti.UI.PORTRAIT];
  Ti.UI.orientation = Ti.UI.PORTRAIT;
  
  mainWindow = Ti.UI.createWindow({
	backgroundImage: (isIpad()) ? 'images/home_ipad.png' : 'images/home.png',
	title: 'Dashboard',
	navBarHidden: true
  });
  Drupal.navGroup = Ti.UI.iPhone.createNavigationGroup({
  	window: mainWindow
  });
  Drupal.navWindow.add(Drupal.navGroup);
  var viewFade = Ti.UI.createView({
  	backgroundColor: '#fff',
  	borderColor:'#888',
  	borderWidth: 4,
  	height: isIpad() ? 340 : 170,
  	width: isIpad() ? 612 : 306,
  	bottom: 20,
  	opacity: 0.75,
  	borderRadius: 8
  });
  var viewIcons = Ti.UI.createView({
  	height: isIpad() ? 340 : 170,
  	width: isIpad() ? 612 : 306,
  	bottom: 20,
  	borderRadius: 8,
  	layout: 'horizontal'
  });
  
  var createIconView = function(iconImage, iconWin, usesNav) {
  	var view = Ti.UI.createView({ 
  		backgroundImage: iconImage, 
  		height: isIpad() ? 170 : 85, 
  		width: isIpad() ? 204 : 102
  	});
  	view.addEventListener('click', function(e) {
  		var leftButton = Ti.UI.createButton({
	    	backgroundImage: 'images/6dots.png',
	    	width: 41,
	    	height: 30
	    });
	    leftButton.addEventListener('click', function(e) {
	    	Drupal.navGroup.close(iconWin, {animated:true});
	    });
	    iconWin.leftNavButton = leftButton;
	    
	    if (usesNav) {
	    	if (isAndroid()) {
	    		// add menu
	    	} else {
		    	var rightButton = Ti.UI.createButton({
		          systemButton: Ti.UI.iPhone.SystemButton.REFRESH
		        });
		        iconWin.rightNavButton = rightButton;
		        rightButton.addEventListener('click', function() {
		          Ti.fireEvent('drupalcon:update_data');
		        });
	        }
	    }
	    
		iconWin.navBarHidden = false;
  		Drupal.navGroup.open(iconWin, {animated:true});
  	});
  	return view;
  };
  
  var presentersWindow = DrupalCon.ui.createPresentersWindow();
  viewIcons.add(createIconView(isIpad() ? 'images/dashboard2/icon_schedule@2x.png' : 'images/dashboard2/icon_schedule.png', DrupalCon.ui.createDayWindow(), true));
  viewIcons.add(createIconView(isIpad() ? 'images/dashboard2/icon_maps@2x.png' : 'images/dashboard2/icon_maps.png', DrupalCon.ui.createMapWindow()));
  viewIcons.add(createIconView(isIpad() ? 'images/dashboard2/icon_news@2x.png' : 'images/dashboard2/icon_news.png', DrupalCon.ui.createTwitterWindow()));
  viewIcons.add(createIconView(isIpad() ? 'images/dashboard2/icon_speakers@2x.png' : 'images/dashboard2/icon_speakers.png', presentersWindow, true));
  viewIcons.add(createIconView(isIpad() ? 'images/dashboard2/icon_sponsors@2x.png' : 'images/dashboard2/icon_sponsors.png', DrupalCon.ui.createHtmlWindow({url: isIpad() ? 'pages/sponsors_ipad.html' : 'pages/sponsors.html', title:'Sponsors'})));
  viewIcons.add(createIconView(isIpad() ? 'images/dashboard2/icon_about@2x.png' : 'images/dashboard2/icon_about.png', DrupalCon.ui.createAboutWindow()));

  mainWindow.add(viewFade);
  mainWindow.add(viewIcons);
  Drupal.navWindow.open({transition:Ti.UI.iPhone.AnimationStyle.CURL_DOWN});

  var updateCount = 0;
  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
  	updateCount++;
  	if (updateCount >= 2) {
  		updateCount = 0;
  		if (presentersWindow) {
  			presentersWindow.doRefresh();
  		}
  		DrupalCon.ui.activityIndicator.hideModal();
  	}
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
  	DrupalCon.ui.activityIndicator.showModal('Loading sessions and speakers...');
    Drupal.entity.db('main', 'node').fetchUpdates('session');
    Drupal.entity.db('main', 'user').fetchUpdates('user');
  });

})();
