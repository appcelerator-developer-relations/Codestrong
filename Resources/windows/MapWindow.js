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
      {title: 'Floor 3 - Grand Ballroom', hasChild:true, backgroundSelectedColor:'#0779BE', color: '#000', image:'images/maps/3rd.png'},
      {title: 'Floor 4 - Pacific Terrace', hasChild:true, backgroundSelectedColor:'#0779BE', color: '#000', image:'images/maps/4th.png'},
      {title: 'Floor 5 - Intercontinental Ballroom', hasChild:true, backgroundSelectedColor:'#0779BE', color: '#000', image:'images/maps/5th.png'}
    ];

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data
    });

    // add table view to the window
    mapWindow.add(tableview);

    mapWindow.addEventListener('focus', function() {
      uiEnabled = true;
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      var mapImage = Ti.UI.createImageView({
        image: e.rowData.image
      });

      var map = Ti.UI.createWindow({
        title: e.rowData.title
      });

      map.add(mapImage);
      if (uiEnabled) {
        uiEnabled = false;
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : mapWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createMapDetailWindow({
          title: e.rowData.title,
          mapName: e.rowData.title,
          image: e.rowData.image,
          info: e.rowData.info,
          tabGroup: currentTab
        }), {animated:true});
      }
    });


    return mapWindow;
  };

})();
