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

  DrupalCon.ui.createDayWindow = function(tabGroup) {

    // Create table view data object.
    var data = [];
    data.push(Ti.UI.createTableViewRow({
    	title:'Sunday, September 18th', 
    	titleShort:'September 18th', 
    	scheduleListing: false, 
    	url: 'pages/2011-09-18.html',
    	font: {
    		fontWeight:'bold'
    	}
    }));
    data.push(Ti.UI.createTableViewRow({
    	title:'Monday, September 19th', 
    	titleShort:'September 19th', 
    	start_date:'2011-09-19 00:00:00', 
    	end_date:'2011-09-20 00:00:00', 
    	scheduleListing: true,
    	font: {
    		fontWeight:'bold'
    	}
    }));
    data.push(Ti.UI.createTableViewRow({
    	title:'Tuesday, September 20th', 
    	titleShort:'September 20th', 
    	start_date:'2011-09-20 00:00:00', 
    	end_date:'2011-09-21 00:00:00', 
    	scheduleListing: true,
    	font: {
    		fontWeight:'bold'
    	}
    }));
    data.push(Ti.UI.createTableViewRow({
    	title:'Hackathon', 
    	titleShort:'Hackathon', 
    	scheduleListing: false, 
    	url: 'pages/hackathon.html',
    	font: {
    		fontWeight:'bold'
    	}
    }));
    
    // add common attributes
    for (var i = 0; i < data.length; i++) {
    	data[i].hasChild = true;
    	data[i].color = '#000';
    	data[i].backgroundColor = '#fff';
    	
    	if (Codestrong.isAndroid()) {
    		data[i].backgroundSelectedColor = '#999';
    	} else {
    		data[i].selectedBackgroundColor = '#999';
    	}
    }

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

    tableview.addEventListener('click', function(e) {
        if (e.rowData.scheduleListing) {
          Codestrong.navGroup.open(DrupalCon.ui.createSessionsWindow({
          	titleShort: e.rowData.titleShort,
            title: e.rowData.title,
            start_date: e.rowData.start_date,
            end_date: e.rowData.end_date
          }), {animated:true});
        }
        else {
          Codestrong.navGroup.open(DrupalCon.ui.createHtmlWindow({
            title: e.rowData.titleShort,
            url: e.rowData.url
          }), {animated:true});
        }
      
    });

    return dayWindow;
  };

})();
