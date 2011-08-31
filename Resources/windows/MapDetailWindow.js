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

  DrupalCon.ui.createMapDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      uid: '',
      name: '',
      tabGroup: undefined
    });

    var mapImageFileName = settings.image;

    var mapDetailWindow = Titanium.UI.createWindow({
      id: 'mapDetailWindow',
      width: 'auto',
      height: 'auto',
      title: settings.mapName,
      barColor: '#414444',
      backgroundColor: '#ffffff',
      //backgroundColor: '#003251',
      tabGroup: settings.tabGroup
    });


  //  I am so tired that I don't know why I am doing math like below.
  //  This undoubtedly needs work.
  var ht = mapDetailWindow.toImage().height;
  if (isAndroid()) {
    var imageView = Ti.UI.createImageView({
      image: mapImageFileName,
      backgroundColor: '#ffffff',
      //backgroundColor:'#003251',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: ht*2,
      width: (ht*2)*1.5,
      canScale: true
    });
    mapDetailWindow.add(imageView);

  }
  else {
    var baseHTML = '<html><head></head><body style="background-color: #ffffff;" class="maps">' +
      '  <meta name="viewport" content="target-densityDpi=device-dpi, user-scalable=yes, width=device-width, initial-scale = .25, minimum-scale = .25, maximum-scale = 4.0" />' +
      '  <meta name="apple-mobile-web-app-capable" content="yes" />' +
      '<div class="map">' +
      '<div><img src="' + mapImageFileName + '" style="width:100%"/></div>' +
      '</body></html>';
    var web = Ti.UI.createWebView({scalesPageToFit:true});
    mapDetailWindow.add(web);
    web.html = baseHTML;
  }

    if(settings.info) {
      // Add a menu or button for a booth list
      if (isAndroid()){
        // Android has a menu
        var buttons = [];
        mapDetailWindow.activity.onCreateOptionsMenu = function(e) {
          var menu = e.menu;

          var m1 = menu.add({
            title : 'Exhibitor List'
          });
          m1.addEventListener('click', function(e) {
            var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : mapDetailWindow.tabGroup.activeTab;
            currentTab.open(DrupalCon.ui.createHtmlWindow({
              title: 'Exhibitors',
              url: 'pages/exhibitors.html',
              tabGroup: currentTab
            }), {animated:true});
          });
        };
      }
      else {
        // iOS should only have the button.
        var button = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.INFO_LIGHT
        });
        var win = mapDetailWindow;
        win.rightNavButton = button;
        button.addEventListener('click', function() {
          var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : mapDetailWindow.tabGroup.activeTab;
            currentTab.open(DrupalCon.ui.createHtmlWindow({
              title: 'Exhibitors',
              url: 'pages/exhibitors.html',
              tabGroup: currentTab
          }), {animated:true});

        });
      }
    }

    return mapDetailWindow;
  };
})();