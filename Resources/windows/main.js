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
	var updateTimeout = 15000;
	var i = 0;
  	var mainWindow = Ti.UI.createWindow({
		backgroundImage: Codestrong.settings.mainBG,
		title: 'Dashboard',
		navBarHidden: true,
		exitOnClose: true
  	});
  	var viewFade = Ti.UI.createView({
  		backgroundColor: '#fff',
  		borderColor:'#888',
  		borderWidth: 4,
  		height: Codestrong.settings.dashboardHeight,
  		width: Codestrong.settings.dashboardWidth,
  		bottom: 20,
  		opacity: 0.75,
  		borderRadius: 8
  	});
  	var viewIcons = Ti.UI.createView({
  		height: Codestrong.settings.dashboardHeight,
  		width: Codestrong.settings.dashboardWidth,
  		bottom: 20,
  		borderRadius: 0,
  		layout: 'horizontal'
  	});
  	mainWindow.add(viewFade);
  	mainWindow.add(viewIcons);
  
    // handle cross-platform navigation
  	if (Codestrong.isAndroid()) {
  		Codestrong.navGroup = {
  			open: function(win, obj) {
  				win.open(obj);	
  			},
  			close: function(win, obj) {
  				win.close(obj);	
  			}
  		};
  		Codestrong.navWindow = mainWindow;
  	} else {
  		Codestrong.navWindow = Ti.UI.createWindow();
	    Codestrong.navGroup = Ti.UI.iPhone.createNavigationGroup({
	  		window: mainWindow
	    });
	  	Codestrong.navWindow.add(Codestrong.navGroup);
  	}
  	
  	// lock orientation to portrait
  	Codestrong.navWindow.orientationModes = [Ti.UI.PORTRAIT];
  	Ti.UI.orientation = Ti.UI.PORTRAIT;
  
  var createIcon = function(icon) {
  	var iconWin = undefined;
  	var view = Ti.UI.createView({ 
  		backgroundImage: icon.image, 
  		top:0,
  		height: Codestrong.settings.icons.height, 
  		width: Codestrong.settings.icons.width
  	});
  	view.addEventListener('click', function(e) {
  		iconWin = icon.func(icon.args);

  		// add a left navigation button for ios
  		if (!isAndroid()) {
	  		var leftButton = Ti.UI.createButton({
		    	backgroundImage: 'images/6dots.png',
		    	width: 41,
		    	height: 30
		    });
		    leftButton.addEventListener('click', function() {
		    	Codestrong.navGroup.close(iconWin, {animated:true});
		    });
		    iconWin.leftNavButton = leftButton;
	    }

		// add sessions and speaker refresh 
	    if (icon.refresh) {
	    	if (Codestrong.isAndroid()) {
	    		iconWin.addEventListener('open', function() {
			        menu.init({
			          	win: iconWin,
			          	buttons: [
			          		{
			          			title: "Update",
			          			clickevent: function () {
			            			Ti.fireEvent('drupalcon:update_data');
			          			}
			          		}
			          	]
			        });
		    	});
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
  		Codestrong.navGroup.open(iconWin, {animated:true});
  	});
  	return view;
  };
  
  for (i = 0; i < Codestrong.settings.icons.list.length; i++) {
  	viewIcons.add(createIcon(Codestrong.settings.icons.list[i]));
  }

	if (isAndroid()) {
		mainWindow.open({animated:true});	
	} else {
		Codestrong.navWindow.open({transition:Ti.UI.iPhone.AnimationStyle.CURL_DOWN});
	}
  //Codestrong.navWindow.open(isAndroid() ? {} : {transition:Ti.UI.iPhone.AnimationStyle.CURL_DOWN});

  var updateCount = 0;
  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
  	updateCount++;
  	if (updateCount >= 2) {
  		updateCount = 0;
  		Ti.App.fireEvent('app:update_presenters');
  		DrupalCon.ui.activityIndicator.hideModal();
  	}
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
  	DrupalCon.ui.activityIndicator.showModal('Loading sessions and speakers...', updateTimeout, 'Connection timed out. All data may not have updated.');
  	updateCount = 0;
    Drupal.entity.db('main', 'node').fetchUpdates('session');
    Drupal.entity.db('main', 'user').fetchUpdates('user');
  });
  
  

})();
