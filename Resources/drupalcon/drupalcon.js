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

var DrupalCon = {
  ui: {},
  util: {},
  renderers: {}
};


(function() {
  var verticalPadding = 2;
  var presenterList = {};

  DrupalCon.util.getPresenterList = function() {
    if (!Object.keys(presenterList).length) {
        var rows = Drupal.db.getConnection('main').query('SELECT name, full_name FROM user');
        while (rows.isValidRow()) {
          presenterList[rows.fieldByName('name')] = rows.fieldByName('full_name');
          rows.next();
        }
        rows.close();
      }
      return presenterList;
  };

  DrupalCon.util.getPresenterName = function(name) {
    var list = DrupalCon.util.getPresenterList();
    return list[name] || '';
  };

  // Clear the presenter list cache when we update data.
  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
    presenterList = {};
  });


  var lastTime = '';

  DrupalCon.renderers.session = function(session) {
    var sessionTitle = Codestrong.cleanSpecialChars(session.title);
    var sessionRow = Ti.UI.createTableViewRow({
      hasChild:true,
      className: 'cs_session',
	  selectedColor: '#000',
      backgroundColor: '#fff',
      color: '#000',
      start_date: session.start_date,
      end_date: session.end_date,
      nid: session.nid,
      sessionTitle: sessionTitle,
      itemType: session.type,
      height: 'auto',
      layout: 'vertical',
      focusable: true
    });
    
    if (Codestrong.isAndroid()) {
		sessionRow.backgroundSelectedColor = '#999';
	} else {
		sessionRow.selectedBackgroundColor = '#999';
	}
    
    var leftSpace = 10;
    var titleColor = '#d32101';

    // If there is a new session time, insert a header in the table.
    var headerRow = undefined;
    if (lastTime == '' || session.start_date != lastTime) {
      lastTime = session.start_date;
      headerRow = Codestrong.createHeaderRow(Codestrong.datetime.cleanTime(lastTime) + " - " + Codestrong.datetime.cleanTime(session.end_date));
    }

    var titleLabel = Ti.UI.createLabel({
      text: sessionTitle,
      font: {fontSize:16, fontWeight:'bold'},
      color: titleColor,
      left: leftSpace,
      top: 10,
      right: 10,
      height: 'auto',
      touchEnabled: false
    });

    // Some sessions have multiple presenters
    var presLabel = Ti.UI.createLabel({
      text: session.instructors, 
      font: {fontSize:14, fontWeight:'bold'},
      color: '#000',
      left: leftSpace,
      top: 4,
      bottom: 0,
      right: 10,
      height: 'auto',
      touchEnabled: false
    });

    // Some things, like keynote, have multiple rooms
    var roomLabel = Ti.UI.createLabel({
      text: session.room, 
      font: {fontSize:14, fontWeight:'normal'},
      color: '#333',
      left: leftSpace,
      top: 2,
      bottom: 10,
      right: 10,
      height: 'auto',
      touchEnabled: false
    });

    sessionRow.add(titleLabel);
    sessionRow.add(presLabel);
    sessionRow.add(roomLabel);

    return [sessionRow, headerRow];
  };

})();
