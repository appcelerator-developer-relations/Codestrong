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

    Codestrong.ui.createDayWindow = function (tabGroup) {
        // Base row properties
        var baseRow = {
            hasChild: true,
            color: '#000',
            backgroundColor: '#fff',
            font: {
                fontWeight: 'bold'
            }
        };
        baseRow[Codestrong.ui.backgroundSelectedProperty + 'Color'] = Codestrong.ui.backgroundSelectedColor;

        // Creates a TableViewRow using the base row properties and a given
        // params object
        var createDayRow = function (params) {
            return Codestrong.extend(Ti.UI.createTableViewRow(params), baseRow);
        }

        // Create data for TableView
        var data = [
	        createDayRow({
	            title: 'Sunday, September 18th',
	            titleShort: 'September 18th',
	            scheduleListing: false,
	            url: 'pages/2011-09-18.html'
	        }), createDayRow({
	            title: 'Monday, September 19th',
	            titleShort: 'September 19th',
	            start_date: '2011-09-19 00:00:00',
	            end_date: '2011-09-20 00:00:00',
	            scheduleListing: true
	        }), createDayRow({
	            title: 'Tuesday, September 20th',
	            titleShort: 'September 20th',
	            start_date: '2011-09-20 00:00:00',
	            end_date: '2011-09-21 00:00:00',
	            scheduleListing: true
	        }), createDayRow({
	            title: 'Hackathon',
	            titleShort: 'Hackathon',
	            scheduleListing: false,
	            url: 'pages/hackathon.html'
	        })
        ];

        // create main day window
        var dayWindow = Titanium.UI.createWindow({
            id: 'win1',
            title: 'Schedule',
            backgroundColor: '#fff',
            barColor: '#414444',
            fullscreen: false
        });
        var tableview = Titanium.UI.createTableView({
            data: data
        });
        dayWindow.add(tableview);

        tableview.addEventListener('click', function (e) {
            if (e.rowData.scheduleListing) {
                Codestrong.navGroup.open(Codestrong.ui.createSessionsWindow({
                    titleShort: e.rowData.titleShort,
                    title: e.rowData.title,
                    start_date: e.rowData.start_date,
                    end_date: e.rowData.end_date
                }), {
                    animated: true
                });
            } else {
                Codestrong.navGroup.open(Codestrong.ui.createHtmlWindow({
                    title: e.rowData.titleShort,
                    url: e.rowData.url
                }), {
                    animated: true
                });
            }

        });

        return dayWindow;
    };
})();