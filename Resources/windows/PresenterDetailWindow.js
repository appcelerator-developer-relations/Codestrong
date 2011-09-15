/**
 * This file is part of CODESTRONG Mobile.
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
 * along with CODESTRONG Mobile.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The CODESTRONG mobile companion app was based off the original work done by the team
 * at palatir.net which included:
 *
 * Larry Garfield
 * Pat Teglia
 * Jen Simmons
 *
 * This code can be located at: https://github.com/palantirnet/drupalcon_mobile
 *
 * The following Appcelerator Employees also spent time answering questions via phone calls, IRC
 * and email and contributed code to the original Drupalcon Mobile application.
 * 
 * Tony Guntharp
 * Chad Auld
 * Don Thorp
 * Marshall Culpepper
 * Stephen Tramer
 * Rick Blalock
 */
(function () {
    Codestrong.ui.createPresenterDetailWindow = function (settings) {
        Drupal.setDefaults(settings, {
            title: 'title here',
            uid: '',
            name: ''
        });

        var presenterData = Drupal.entity.db('main', 'user').load(settings.uid);
        var presenterDetailWindow = Titanium.UI.createWindow({
            id: 'presenterDetailWindow',
            title: presenterData.full_name,
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });
        presenterDetailWindow.orientationModes = [Ti.UI.PORTRAIT];

        var tvData = [];
        var tv = Ti.UI.createTableView({
            textAlign: 'left',
            width: '100%',
            separatorColor: '#fff'
        });
        tv.footerView = Ti.UI.createView({
            height: 1,
            opacity: 0
        });

        var av = Ti.UI.createImageView({
            image: presenterData.picture.replace(/^\s+|\s+$/g, '') || 'images/userpict-large.png',
            left: 0,
            top: 0,
            height: 110,
            width: 110,
            defaultImage: 'images/userpict-large.png',
            backgroundColor: '#000',
            touchEnabled: false
        });
        var headerRow = Ti.UI.createTableViewRow({
            height: 110,
            backgroundImage: 'images/sessionbckgd@2x.png',
            className: 'presHeaderRow',
            left: 0,
            top: -5,
            bottom: 0,
            layout: 'vertical',
            selectionStyle: 'none'
        });
        headerRow[Codestrong.ui.backgroundSelectedProperty + 'Image'] = 'images/sessionbckgd@2x.png';

        var bioRow = Ti.UI.createTableViewRow({
            hasChild: false,
            height: 'auto',
            width: '100%',
            selectionStyle: 'none'
        });

        // Add the avatar image to the view
        headerRow.add(av);

        if (presenterData.full_name != undefined) {
            var fullName = Ti.UI.createLabel({
                text: Codestrong.cleanSpecialChars(presenterData.full_name),
                font: {
                    fontSize: 20,
                    fontWeight: 'bold'
                },
                textAlign: 'left',
                color: '#000',
                height: 'auto',
                left: 120,
                top: -95,
                ellipsize: true,
                touchEnabled: false
            });
            headerRow.add(fullName);
        }

        if (presenterData.company != undefined) {
            var company = Ti.UI.createLabel({
                text: Codestrong.cleanSpecialChars(presenterData.company),
                font: {
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                textAlign: 'left',
                color: '#666',
                height: 'auto',
                left: 120,
                touchEnabled: false
            });
            headerRow.add(company);
        }
        tvData.push(headerRow);

        var sessions = getRelatedSessions(presenterData.full_name);
        var sessionRow = [];
        if (sessions && sessions.length) {
            tvData.push(Codestrong.ui.createHeaderRow('Sessions'));
            for (var i in sessions) {
                sessionRow = Ti.UI.createTableViewRow({
                    hasChild: true,
                    sessionTitle: Codestrong.cleanSpecialChars(sessions[i].title),
                    nid: sessions[i].nid,
                    height: 'auto',
                    backgroundColor: '#CE3016'
                });
                sessionRow[Codestrong.ui.backgroundSelectedProperty + 'Color'] = Codestrong.ui.backgroundSelectedColor;

                var titleLabel = Ti.UI.createLabel({
                    text: Codestrong.cleanSpecialChars(sessions[i].title),
                    font: {
                        fontSize: 14,
                        fontWeight: 'normal'
                    },
                    left: 10,
                    top: 10,
                    right: 10,
                    bottom: 10,
                    height: 'auto',
                    color: '#fff',
                    font: {
                        fontWeight: 'bold'
                    },
                    touchEnabled: false
                });
                sessionRow.add(titleLabel);

                // create table view event listener
                sessionRow.addEventListener('click', function (e) {
                    Codestrong.navGroup.open(Codestrong.ui.createSessionDetailWindow({
                        title: e.rowData.sessionTitle,
                        nid: e.rowData.nid
                    }), {
                        animated: true
                    });
                });

                tvData.push(sessionRow);
            }
        }

        var bioText = (!presenterData.bio) ? "No biography available" : Codestrong.cleanSpecialChars(presenterData.bio.replace(/^[\s\n\r\t]+|[\s\n\r\t]+$/g, '').replace(/\n/g, "\n\n"));
        var bio = Ti.UI.createLabel({
            text: bioText,
            backgroundColor: '#fff',
            textAlign: 'left',
            color: '#000',
            height: 'auto',
            width: Codestrong.isAndroid() ? '92%' : 'auto',
            top: 10,
            bottom: 10,
            font: {
                fontSize: 16
            }
        });

        if (!Codestrong.isAndroid()) {
            bio.right = 10;
            bio.left = 10;
        }

        bioRow.add(bio);
        tvData.push(Codestrong.ui.createHeaderRow('Biography'));
        tvData.push(bioRow);

        tv.setData(tvData);
        presenterDetailWindow.add(tv);

        return presenterDetailWindow;
    };

    function getRelatedSessions(name) {
        var conn = Drupal.db.getConnection('main');
        var rows = conn.query("SELECT nid, title FROM node WHERE instructors LIKE ? ORDER BY start_date, nid", ['%' + name + '%']);

        var nids = [];
        while (rows.isValidRow()) {
            nids.push(rows.fieldByName('nid'));
            rows.next();
        }
        rows.close();

        return Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);
    }

})();