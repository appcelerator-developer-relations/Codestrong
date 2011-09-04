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

  // create tab group
  var tabGroup = Titanium.UI.createTabGroup({
    id:'tabGroup1'
  });

  tabGroup.addTab(Titanium.UI.createTab({
    icon: (isAndroid()) ? 'images/tabs/schedule_android.png' : 'images/tabs/schedule.png',
    title: 'Schedule',
    window: DrupalCon.ui.createDayWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
    icon: (isAndroid()) ? 'images/tabs/maps_android.png' : 'images/tabs/maps.png',
    title: 'Maps',
    window: DrupalCon.ui.createMapWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: (isAndroid()) ? 'images/tabs/news_android.png' : 'images/tabs/news.png',
      title: 'News',
      window: DrupalCon.ui.createTwitterWindow(tabGroup)
  }));

  var presentersWindow = DrupalCon.ui.createPresentersWindow(tabGroup);
  tabGroup.addTab(Titanium.UI.createTab({
      icon: (isAndroid()) ? 'images/tabs/bofs_android.png' : 'images/tabs/bofs.png',
      title: 'Speakers',
      window: presentersWindow
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: (isAndroid()) ? 'images/tabs/about_android.png' : 'images/tabs/about.png',
      title: 'About',
      window: DrupalCon.ui.createAboutWindow()
      //window: DrupalCon.ui.createHtmlWindow({title: 'About CODESTRONG', url: 'pages/about.html', tabGroup: tabGroup})
  }));

  tabGroup.addEventListener('open',function() {
    // set background color back to white after tab group transition
    Titanium.UI.setBackgroundColor('#fff');
  });

  // Display the tab group, thus kicking off the application.
  tabGroup.setActiveTab(0);
  // open tab group with a transition animation
  tabGroup.open({
    transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
  });

  // tab group close event
  tabGroup.addEventListener('close', function(e) {

  });

  // tab group open event
  tabGroup.addEventListener('open', function(e) {

  });

  // Add a menu to all pages except news (which would be confusing).
  tabGroup.addEventListener('focus', function(e) {
    //dpm(e.index);
    if (e.index != 1 && e.index !=2){
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
