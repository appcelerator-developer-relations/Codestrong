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

/*
 * This is the page of session listings.
 */
(function() {

  DrupalCon.ui.createSessionsWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      start_date: '',
      end_date: ''
    });

    var sessionsWindow = Titanium.UI.createWindow({
      id: 'sessionsWindow',
      title: settings.titleShort,
      backgroundColor: '#FFF',
      barColor: '#414444'
    });

    var data = [];

    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT nid FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY start_date, nid", [settings.start_date, settings.end_date]);
    var nids = [];

    while(rows.isValidRow()) {
      nids.push(rows.fieldByName('nid'));
      rows.next();
    }
    rows.close();

    var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);

    for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
      var items = DrupalCon.renderers['session'](sessions[sessionNum]);
      if (items[1]) {
      	data.push(items[1]);
      }
      data.push(items[0]);
    }

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data,
      backgroundColor: '#fff',
      layout:'vertical'
    });

    // Create table view event listener.
    tableview.addEventListener('click', function(e) {
    	if (e.rowData.nid) {
	        Drupal.navGroup.open(DrupalCon.ui.createSessionDetailWindow({
	          title: e.rowData.sessionTitle,
	          nid: e.rowData.nid
	        }), {animated:true});
        }
    });

    // add table view to the window
    sessionsWindow.add(tableview);

    return sessionsWindow;
  };

})();

