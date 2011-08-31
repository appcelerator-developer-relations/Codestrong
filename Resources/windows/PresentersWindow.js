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

  DrupalCon.ui.createPresentersWindow = function(tabGroup) {
    var PresentersWindow = Titanium.UI.createWindow({
      id: 'presentersWindow',
      title: 'Speakers',
      backgroundColor: '#FFF',
      barColor: '#414444',
      tabGroup: tabGroup
    });
    
    // Create the table view
    var tableview = Titanium.UI.createTableView({
      backgroundColor: '#fff'//,
      //data: data
    });

	PresentersWindow.doRefresh = function() {
    	var nameList = getNameList();

	    // I want our list of names to have the usernames mixed in, and they usually
	    // start with lowercase, so we need to create a custom sortorder that ignores case.
	    var sortedNames = nameList.sort(function(a, b) {
	      a = a.toLowerCase();
	      b = b.toLowerCase();
	      if (a > b) { return 1; }
	      if (a < b) { return -1; }
	      return 0;
	    });

	    // Now we can do something, like, oh I don't know, build the table :)
	    var headerLetter = '';
	    var index = [];
	    var index2 = [];
	    var presenterRow = [];
	    var data = [];

	    for (var i in sortedNames) {
	      var user = sortedNames[i].split(':');
	      var uid = parseInt(user[1]) + 0;
	      var fullName = user[0] + '';
	      
	      var shortName = user[2] + '';
	      var name = shortName;
	      if (fullName.charAt(fullName.length-2) == ',') {
	        fullName = fullName.slice(0, fullName.length - 2);
	      }
	      else {
	        name = fullName;
	      }
	
	      presenterRow = Ti.UI.createTableViewRow({
	        hasChild: true,
	        selectedColor: '#fff',
	        backgroundColor: '#fff',
	        backgroundSelectedColor: '#0779BE',
	        color: '#000',
	        name: name,
	        uid: uid,
	        height: 40,
	        layout: 'auto'
	      });
	
	      if (fullName == shortName) {
	        fullName = '';
	      }
	      else {
	        fullName = cleanSpecialChars(fullName);
	        var firstLastName = fullName.split(', ');
	        fullName = firstLastName[1] + ' ' + firstLastName[0];
	        shortName = "(" + shortName + ")";
	        var lastName = firstLastName[0];
	        var firstName = firstLastName[1];
	      }
	      
	
	      // Android can't handle some of this label manipulation
	      if (isAndroid()) {
	        presenterRow.add(Ti.UI.createLabel({
	        text: fullName, // + '  ' + shortName,
	        fontFamily:'sans-serif',
	        left: (fullName != '') ? 9 : 0,
	        height: 40,
	        color: '#000'
	        }));
	
	        
	      }
	      else {
	        // iPhone - make it fancy
	        var firstLeft = 0;
	        var lastLeft = 0;
	
	        if (fullName != '') {
	          var firstNameLabel = Ti.UI.createLabel({
	            text: firstName,
	            font:'Helvetica',
	            left: 10,
	            height: 40,
	            color: '#000'
	          });
	          presenterRow.add(firstNameLabel);
	          firstLeft = firstNameLabel.toImage().width+10;
	        
	          var lastNameLabel = Ti.UI.createLabel({
	            text: lastName,
	            font:'Helvetica-Bold',
	            left: firstLeft + 5,
	            height: 40,
	            color: '#000'
	          });
	          presenterRow.add(lastNameLabel);
	          lastLeft = firstLeft + lastNameLabel.toImage().width;
	        }
	
	        // if (shortName != '') {
	          // var shortNameLabel = Ti.UI.createLabel({
	            // text: shortName,
	            // font:'Helvetica',
	            // left: lastLeft+10,
	            // height: 40,
	            // color: '#666'
	          // });
	          // presenterRow.add(shortNameLabel);
	        // }
	        
	      }
	
	      // If there is a new last name first letter, insert a header in the table.
	      // We also push a new index so we can create a right side index for iphone.
	      if (headerLetter == '' || name.charAt(0).toUpperCase() != headerLetter) {
	        headerLetter = name.charAt(0).toUpperCase();
	    	presenterRow.header = headerLetter;
	    	index.push({title:headerLetter,index:i});
	    	index2.push({title:headerLetter+headerLetter,index:i});
	      }
	
	      data.push(presenterRow);
	    }
	    
	    tableview.setData(data);
	    tableview.index = index;
	};
    
	PresentersWindow.doRefresh();

    PresentersWindow.addEventListener('focus', function() {
      uiEnabled = true;
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      if (uiEnabled) {
        uiEnabled = false;
        // if (e.index == 0) {
          // tableview.index = index2;
        // }
        
        // event data
        var index = e.index;
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : PresentersWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createPresenterDetailWindow({
          title: e.rowData.name,
          uid: e.rowData.uid,
          name: e.rowData.name,
          tabGroup: currentTab
        }), {animated:true});
      }
    });

    // add table view to the window
    PresentersWindow.add(tableview);

    return PresentersWindow;
  };


  function getNameList() {
    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT uid, name, full_name FROM user");

    // As far as I can tell, objects aren't allowed to be sorted, so even though
    // I can write a sort on say a.lastName - it won't stay sorted (yes I tried)
    // so I have to build an array, sort it, then decompile it to use it.
    // Have I mentioned lately that javascript is not my favorite language right now?
    var nameList = [];
    if (rows) {
      while (rows.isValidRow()) {
        var uid = rows.fieldByName('uid');
        //dpm(rows.fieldByName('full_name'));
        var full = rows.fieldByName('full_name');
        if (full) {
          var names = rows.fieldByName('full_name').split(' ');
          var lastName = names[names.length -1];
          var firstName = full.substr(0,full.length - (lastName.length + 1));
          nameList.push(lastName + ', ' + firstName + ':' + rows.fieldByName('uid') + ':' + rows.fieldByName('name'));
        }
        else {
          nameList.push(rows.fieldByName('name') + ':' + rows.fieldByName('uid') + ':' + rows.fieldByName('name'));
        }
        rows.next();
      }
      rows.close();
    }

    return nameList;
  }
  
})();
