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

    Codestrong.ui.createSessionDetailWindow = function (settings) {
        Drupal.setDefaults(settings, {
            title: 'title here',
            nid: ''
        });
        var commonPadding = 15;
        var sessionDetailWindow = Titanium.UI.createWindow({
            id: 'sessionDetailWindow',
            title: settings.title,
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });
        sessionDetailWindow.orientationModes = [Ti.UI.PORTRAIT];

        // Build session data
        var sessionData = Drupal.entity.db('main', 'node').load(settings.nid);
        
        var tvData = [];
        var tv = Ti.UI.createTableView({
            textAlign: 'left',
            layout: 'vertical',
            separatorColor: '#fff'
        });
        tv.footerView = Ti.UI.createView({
            height: 1,
            opacity: 0
        });

        var headerRow = Ti.UI.createTableViewRow({
            height: 'auto',
            left: 0,
            top: -5,
            bottom: 10,
            layout: 'vertical',
            className: 'mainHeaderRow',
            backgroundImage: 'images/sessionbckgd@2x.png',
            backgroundPosition: 'bottom left',
            selectionStyle: 'none'
        });
        headerRow[Codestrong.ui.backgroundSelectedProperty + 'Image'] = 'images/sessionbckgd@2x.png';

        var bodyRow = Ti.UI.createTableViewRow({
            hasChild: false,
            height: 'auto',
            backgroundColor: '#fff',
            left: 0,
            top: -5,
            bottom: 10,
            layout: 'vertical',
            className: 'bodyRow',
            selectionStyle: 'none'
        });

        if (sessionData.title) {
            var titleLabel = Ti.UI.createLabel({
                text: Codestrong.cleanSpecialChars(sessionData.title),
                font: {
                    fontSize: 28,
                    fontWeight: 'bold'
                },
                textAlign: 'left',
                color: '#000',
                left: commonPadding,
                top: 18,
                bottom: 7,
                right: commonPadding,
                height: 'auto'
            });
            headerRow.add(titleLabel);
        }

        if (sessionData.start_date) {
            var matches = /^(\d{4})\-(\d{2})\-(\d{2})/.exec(sessionData.start_date);
            var startDate = new Date(matches[1], matches[2] - 1, matches[3]);
            var datetime = Ti.UI.createLabel({
                text: Codestrong.datetime.cleanDate(startDate) + ', ' + Codestrong.datetime.cleanTime(sessionData.start_date),
                font: {
                    fontSize: 18,
                    fontWeight: 'normal'
                },
                textAlign: 'left',
                color: '#000',
                left: commonPadding,
                top: 'auto',
                bottom: 5,
                right: 'auto',
                height: 'auto'
            });
            headerRow.add(datetime);
        }

        var skipRoom;
        if (sessionData.title === 'Lunch' || sessionData.title === 'Break' || sessionData.title.indexOf('Party') !== -1) {
            skipRoom = true;
        }

        if (sessionData.room && !skipRoom) {
            var room = Ti.UI.createLabel({
                text: sessionData.room,
                font: {
                    fontSize: 18,
                    fontWeight: 'normal'
                },
                textAlign: 'left',
                color: '#000',
                left: commonPadding,
                top: 'auto',
                bottom: 12,
                right: commonPadding,
                height: 'auto'
            });
            headerRow.add(room);
        }

        if (sessionData.body) {
            var body = Ti.UI.createLabel({
                text: Codestrong.cleanSpecialChars(sessionData.body.replace('\n', '\n\n')),
                backgroundColor: '#fff',
                textAlign: 'left',
                color: '#000',
                height: 'auto',
                width: Codestrong.isAndroid() ? '92%' : 'auto',
                top: 15,
                bottom: 15,
                font: {
                    fontSize: 16
                }
            });
            bodyRow.add(body);
        }

        if (!Codestrong.isAndroid()) {
            body.right = commonPadding;
            body.left = commonPadding;
        }

        tvData.push(headerRow);

        if (sessionData.instructors) {
            var instructorList = sessionData.instructors.split(",");
            for (var k = 0; k < instructorList.length; k++) {
                instructorList[k] = instructorList[k].replace(/^\s+|\s+$/g, '');
            }

            // Get the presenter information.
            var presenterData = Drupal.entity.db('main', 'user').loadByField('full_name', instructorList); //sessionData.instructors);
            tvData.push(Codestrong.ui.createHeaderRow((instructorList.length > 1) ? 'Speakers' : 'Speaker'));
            for (var j in presenterData) {
                tvData.push(renderPresenter(presenterData[j]));
            }
        }

        tvData.push(Codestrong.ui.createHeaderRow('Description'));
        tvData.push(bodyRow);

        tv.addEventListener('click', function (e) {
            if (e.source.presenter != undefined) {
                var fullName = e.source.presenter.full_name || '';
                Codestrong.navGroup.open(Codestrong.ui.createPresenterDetailWindow({
                    title: fullName,
                    uid: e.source.presenter.uid
                }), {
                    animated: true
                });
            }
        });
        tv.setData(tvData);
        sessionDetailWindow.add(tv);

        return sessionDetailWindow;
    };

    function renderPresenter(presenter) {
        var userPict = presenter.picture.replace(/^\s+|\s+$/g, '') || 'images/userpict-large.png';

        var av = Ti.UI.createImageView({
            image: userPict,
            left: 5,
            top: 5,
            height: 50,
            width: 50,
            defaultImage: 'images/userpict-large.png',
            backgroundColor: '#000',
            touchEnabled: false
        });

        var presRow = Ti.UI.createTableViewRow({
            presenter: presenter,
            height: 60,
            className: 'presenterRow',
            borderColor: '#C4E2EF',
            hasChild: true,
            backgroundColor: '#CE3016',
            layout: 'vertical'
        });
        presRow[Codestrong.ui.backgroundSelectedProperty + 'Color'] = Codestrong.ui.backgroundSelectedColor;

        presRow.add(av);
        var presenterFullName2 = Ti.UI.createLabel({
            presenter: presenter,
            text: Codestrong.cleanSpecialChars(presenter.full_name),
            font: {
                fontSize: 18,
                fontWeight: 'bold'
            },
            left: 75,
            top: -45,
            height: 'auto',
            color: '#fff',
            touchEnabled: false
        });

        var presenterName2 = Ti.UI.createLabel({
            presenter: presenter,
            text: Codestrong.cleanSpecialChars(presenter.company),
            font: {
                fontSize: 14,
                fontWeight: 'normal'
            },
            left: 75,
            bottom: 10,
            height: 'auto',
            color: "#fff",
            touchEnabled: false
        });

        presRow.add(presenterFullName2);
        presRow.add(presenterName2);

        return presRow;
    }
})();