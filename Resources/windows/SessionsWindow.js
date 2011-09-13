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
(function () {

    Codestrong.ui.createSessionsWindow = function (settings) {
        Drupal.setDefaults(settings, {
            title: 'title here',
            start_date: '',
            end_date: ''
        });

        var sessionsWindow = Titanium.UI.createWindow({
            id: 'sessionsWindow',
            title: settings.titleShort,
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });
        sessionsWindow.orientationModes = [Ti.UI.PORTRAIT];

        var data = [];
        var conn = Drupal.db.getConnection('main');
        var rows = conn.query("SELECT nid FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY start_date, nid", [settings.start_date, settings.end_date]);
        var nids = [];

        while (rows.isValidRow()) {
            nids.push(rows.fieldByName('nid'));
            rows.next();
        }
        rows.close();

		// Create session rows
		var lastTime = '';
        var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);
        for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
            var session = sessions[sessionNum];
            var sessionTitle = Codestrong.cleanSpecialChars(session.title);
            var sessionRow = Ti.UI.createTableViewRow({
                hasChild: true,
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
                font: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
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
                font: {
                    fontSize: 14,
                    fontWeight: 'bold'
                },
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
                font: {
                    fontSize: 14,
                    fontWeight: 'normal'
                },
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

			if (headerRow) {
				data.push(headerRow);	
			}
			data.push(sessionRow);
        }

        // create table view
        var tableview = Titanium.UI.createTableView({
            data: data,
            backgroundColor: '#fff',
            layout: 'vertical'
        });

        // Create table view event listener.
        tableview.addEventListener('click', function (e) {
            if (e.rowData.nid) {
                Codestrong.navGroup.open(Codestrong.ui.createSessionDetailWindow({
                    title: e.rowData.sessionTitle,
                    nid: e.rowData.nid
                }), {
                    animated: true
                });
            }
        });

        // add table view to the window
        sessionsWindow.add(tableview);

        return sessionsWindow;
    };

})();