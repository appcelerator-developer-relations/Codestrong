/**
 * This file is part of  CODESTRONG Mobile.
 *
 * CODESTRONG Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CODESTRONG Mobile is distributed in the hope that it will be useful,
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
    var sessionTitle = cleanSpecialChars(session.title);

    var sessionRow = Ti.UI.createTableViewRow({
      hasChild:true,
      selectedColor: '#669999',
      backgroundColor: '#fff',
      color: '#000',
      start_date: session.start_date,
      end_date: session.end_date,
      nid: session.nid,
      sessionTitle: sessionTitle,
      itemType: session.type,
      height: 'auto',
      layout: 'vertical'
    });

    var leftSpace = (Ti.Platform.name == 'android') ? 30 : 40;
    var titleColor = '';
    switch (session.track) {
      case "":
        leftSpace = 10;
        titleColor = '#d32101';
        break;
      case "Design and UX":
        sessionRow.leftImage = 'images/uxdesign.png';
        titleColor = '#dd3793';
        break;
      case "Coder":
        sessionRow.leftImage = 'images/coder.png';
        titleColor = '#e76828';
        break;
      case "Business and Strategy":
        sessionRow.leftImage = 'images/business.png';
        titleColor = '#85a951';
        break;
      case "Implementation and Config":
        sessionRow.leftImage = 'images/config.png';
        titleColor = '#f0b539';
        break;
      case "Drupal Community":
        sessionRow.leftImage = 'images/community.png';
        titleColor = '#7fbfea';
        break;
      case "Core Conversations":
        sessionRow.leftImage = 'images/coreconv.png';
        titleColor = '#3176bd';
        break;
      case "Theming":
        sessionRow.leftImage = 'images/theming.png';
        titleColor = '#e5393e';
        break;
      default:
        leftSpace = 10;
        titleColor = '#d32101';
        break;
    }

    // If there is a new session time, insert a header in the table.
    if (lastTime == '' || session.start_date != lastTime) {
      lastTime = session.start_date;
      sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
    }

    var titleLabel = Ti.UI.createLabel({
      text: sessionTitle,
      font: {fontSize:16, fontWeight:'bold'},
      color: titleColor,
      left: leftSpace,
      top: 10,
      right: 10,
      height: 'auto'
    });

    // Some sessions have multiple presenters
    var presLabel = Ti.UI.createLabel({
      text: cleanSpecialChars(session.instructors.map(DrupalCon.util.getPresenterName).join(', ')),
      font: {fontSize:14, fontWeight:'normal'},
      color: '#000',
      left: leftSpace,
      top: 4,
      bottom: 0,
      right: 10,
      height: 'auto'
    });

    // Some things, like keynote, have multiple rooms
    var roomLabel = Ti.UI.createLabel({
      text: session.room.map(cleanSpecialChars).join(', '),
      font: {fontSize:14, fontWeight:'normal'},
      color: '#333',
      left: leftSpace,
      top: 2,
      bottom: 10,
      right: 10,
      height: 'auto'
    });

    sessionRow.add(titleLabel);
    sessionRow.add(presLabel);
    sessionRow.add(roomLabel);

    return sessionRow;
  };

  DrupalCon.renderers.coreconversation = function(session) {
    var sessionTitle = cleanSpecialChars(session.title);

    var sessionRow = Ti.UI.createTableViewRow({
      hasChild:true,
      selectedColor: '#669999',
      backgroundColor: '#fefefe',
      color: '#000',
      leftImage:'images/coreconv.png',
      start_date: session.start_date,
      end_date: session.end_date,
      nid: session.nid,
      sessionTitle: sessionTitle,
      itemType: session.type,
      height: 'auto',
      layout: 'vertical'
    });

    var leftSpace = (Ti.Platform.name == 'android') ? 30 : 40;
    var titleColor = '#3176bd';

    // If there is a new session time, insert a header in the table.
    if (lastTime == '' || session.start_date != lastTime) {
      lastTime = session.start_date;
      sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
    }

    var titleLabel = Ti.UI.createLabel({
      text: sessionTitle,
      font: {fontSize:16, fontWeight:'normal'},
      color: titleColor,
      left: leftSpace,
      top: 10,
      bottom: 2,
      right: 10,
      height: 'auto'
    });

    // Some sessions have multiple presenters.
    var presLabel = Ti.UI.createLabel({
      text: session.instructors.map(DrupalCon.util.getPresenterName).join(', '),
      font: {fontSize:14, fontWeight:'normal'},
      color: '#000',
      left: leftSpace,
      top: 2,
      bottom: 0,
      right: 10,
      height: 'auto'
    });

    // Some things, like keynote, have multiple rooms
    var roomLabel = Ti.UI.createLabel({
      text: session.room.map(cleanSpecialChars).join(', '),
      font: {fontSize:14, fontWeight:'normal'},
      color: '#333',
      left: leftSpace,
      top: 2,
      bottom: 10,
      right: 10,
      height: 'auto'
    });

    sessionRow.add(titleLabel);
    sessionRow.add(presLabel);
    sessionRow.add(roomLabel);

    return sessionRow;
  };

  DrupalCon.renderers.day_stage = function(session) {
    var sessionTitle = cleanSpecialChars(session.title);

    var sessionRow = Ti.UI.createTableViewRow({
      hasChild:true,
      selectedColor: '#669999',
      backgroundColor: '#fefefe',
      color: '#000',
      leftImage: 'images/daystage.png',
      start_date: session.start_date,
      end_date: session.end_date,
      nid: session.nid,
      sessionTitle: sessionTitle,
      itemType: session.type,
      height: 'auto',
      layout: 'vertical'
    });
    var titleColor = '#ab7d66';

    if (session.start_date.substr(8,2) == '10') {
      sessionRow.leftImage = 'images/dmb.png';
      titleColor = '#269477';
    }
    var leftSpace = (Ti.Platform.name == 'android') ? 30 : 40;

    // If there is a new session time, insert a header in the table.
    if (lastTime == '' || session.start_date != lastTime) {
      lastTime = session.start_date;
      sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
    }

    var titleLabel = Ti.UI.createLabel({
      text: sessionTitle,
      font: {fontSize:16, fontWeight:'bold'},
      color: titleColor,
      left: leftSpace,
      top: 10,
      bottom: 2,
      right: 10,
      height: 'auto'
    });

    // Day Stage entries may not have presenters, because the sponsors didn't
    // get their information submitted in time. Sigh.
    if (session.instructors) {
      var presLabel = Ti.UI.createLabel({
        text: session.instructors.map(DrupalCon.util.getPresenterName).join(', '),
        font: {fontSize:14, fontWeight:'normal'},
        color: '#000',
        left: leftSpace,
        top: 2,
        bottom: 0,
        right: 10,
        height: 'auto'
      });
    }

    // Some things, like keynote, have multiple rooms
    var roomLabel = Ti.UI.createLabel({
      text: session.room.map(cleanSpecialChars).join(', '),
      font: {fontSize:14, fontWeight:'normal'},
      color: '#333',
      left: leftSpace,
      top: 2,
      bottom: 10,
      right: 10,
      height: 'auto'
    });

    sessionRow.add(titleLabel);
    sessionRow.add(presLabel);
    sessionRow.add(roomLabel);

    return sessionRow;
  };

  DrupalCon.renderers.schedule_item = function(session) {
    var sessionTitle = cleanSpecialChars(session.title);

    var sessionRow = Ti.UI.createTableViewRow({
      hasChild: true,
      hasDetail: true,
      selectedColor: '#fff',
      backgroundColor: '#fefefe',
      color: '#000',
      start_date: session.start_date,
      end_date: session.end_date,
      nid: session.nid,
      sessionTitle: sessionTitle,
      itemType: session.type,
      height: 'auto',
      layout: 'vertical'
    });

    var leftSpace = (Ti.Platform.name == 'android') ? 30 : 40;
    var titleColor = '#333';

    // If there is a new session time, insert a header in the table.
    if (lastTime == '' || session.start_date != lastTime) {
      lastTime = session.start_date;
      sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
    }

    var titleLabel = Ti.UI.createLabel({
      text: sessionTitle,
      font: {fontSize:16, fontWeight:'bold'},
      color: titleColor,
      left: leftSpace,
      top: 10,
      right: 10,
      bottom: 10,
      height: 'auto'
    });

    sessionRow.add(titleLabel);

    return sessionRow;
  };

})();
