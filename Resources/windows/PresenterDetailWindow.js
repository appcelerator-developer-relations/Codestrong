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

  DrupalCon.ui.createPresenterDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      uid: '',
      name: '',
      tabGroup: undefined
    });

    // var presenterData = settings.data;
    var presenterData = Drupal.entity.db('main', 'user').load(settings.uid);

    var presenterDetailWindow = Titanium.UI.createWindow({
      id: 'presenterDetailWindow',
      title: presenterData.full_name,
      backgroundColor: '#FFF',
      barColor: '#414444',
      tabGroup: settings.tabGroup
    });

    var tvData = [];
    var blueBg = '#C4E2EF';
    var	platformWidth = Ti.Platform.displayCaps.platformWidth;
    var platformHeight = Ti.Platform.displayCaps.platformHeight;

    // Structure
    var tv = Ti.UI.createTableView({
      textAlign: 'left',
      layout:'vertical'
    });

    //var userPict = avatarPath(presenterData.uid);
    //dpm(userPict);
    
    var av = Ti.UI.createImageView({
      image:presenterData.picture.replace(/^\s+|\s+$/g, '') || 'images/userpict-large.png',
      left:0,
      top:0,
      height:110,
      width:110,
      defaultImage:'images/userpict-large.png',
      backgroundColor: '#000'
    });
    var headerRow = Ti.UI.createTableViewRow({
      height:110,
      backgroundColor:blueBg,
      left:0,
      top:-5,
      bottom:0,
      layout:'vertical',
      selectionStyle:'none'
    });
    var twitterRow = Ti.UI.createTableViewRow({hasChild:true,height:41});
    var linkedinRow = Ti.UI.createTableViewRow({hasChild:true,height:41});
    var facebookRow = Ti.UI.createTableViewRow({hasChild:true,height:41});
    var bioRow = Ti.UI.createTableViewRow({hasChild:false,height:'auto',selectionStyle:'none'});

    // Add the avatar image to the view
    headerRow.add(av);

    if (presenterData.full_name != undefined) {
      var fullName = Ti.UI.createLabel({
        text: cleanSpecialChars(presenterData.full_name),
        font: {fontSize: 20, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#000',
        height: 'auto',
        left: 120,
        top: -95,
        ellipsize:true
      });
      headerRow.add(fullName);
    }

    // var name = Ti.UI.createLabel({
      // text: (presenterData.full_name !== presenterData.name) ? cleanSpecialChars(presenterData.name) : '',
      // font: {fontSize: 14, fontWeight: 'bold'},
      // textAlign: 'left',
      // color: '#04679C',
      // height: 'auto',
      // left: 120,
      // top: (presenterData.full_name != undefined) ? 2 : -95
    // });
    // headerRow.add(name);

    if (presenterData.company != undefined) {
      var company = Ti.UI.createLabel({
        text:presenterData.company,
        font:{fontSize: 14, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#999',
        height: 'auto',
        left: 120
      });
      headerRow.add(company);
    }

    tvData.push(headerRow);


    if (presenterData.twitter != undefined){
      var twitter = Ti.UI.createLabel({
        text: "twitter: " + presenterData.name,
        twitter: presenterData.twitter,
        color: '#000',
        font: {fontSize: 14, fontWeight: 'bold'},
        left: 10,
        right: 10,
        height: 'auto'
      });

      twitter.addEventListener('click', function(e) {
        var webview = Titanium.UI.createWebView({url:e.source.twitter});
        var webWindow = Titanium.UI.createWindow();
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : presenterDetailWindow.tabGroup.activeTab;
        webWindow.add(webview);
        currentTab.open(webWindow);
      });
      twitterRow.add(twitter);
      tvData.push(twitterRow);
    }

//    if (presenterData.data.linkedin != undefined){
//
//    }
//
//    if (presenterData.data.facebook != undefined){
//
//    }
    

//    var sessionsTitle = Ti.UI.createLabel({
//      text:"Session(s)",
//      backgroundColor:'#fff',
//      textAlign:'left',
//      font:{fontSize:18, fontWeight:'bold'},
//      color:'#000',
//      top:20,
//      left: 10,
//      bottom: 10,
//      width:itemWidth,
//      height:'auto'
//    });
//
//    var sessionsTitleRow = Ti.UI.createTableViewRow({height: 'auto', className: 'sessionTitleRow', borderColor: '#fff'});
//    sessionsTitleRow.add(sessionsTitle);
//    tvData.push(sessionsTitleRow);


    var sessions = getRelatedSessions(presenterData.full_name);
    var sessionRow = [];
    if (sessions && sessions.length) {
    	var sessionSection = Ti.UI.createTableViewSection({headerTitle:'Sessions'});
    
	    for (var i in sessions) {
	      sessionRow = Ti.UI.createTableViewRow({
	        hasChild:true,
	        sessionTitle:cleanSpecialChars(sessions[i].title),
	        nid:sessions[i].nid,
	        height: 'auto',
	        backgroundColor: '#dc5531'
	      });
	
	      var titleLabel = Ti.UI.createLabel({
	        text: cleanSpecialChars(sessions[i].title),
	        font: {fontSize:14, fontWeight:'normal'},
	        left: 10,
	        top: 10,
	        right: 10,
	        bottom: 10,
	        height: 'auto',
	        color: '#fff',
	        font:{fontWeight:'bold'}
	      });
	      sessionRow.add(titleLabel);
	      
	      // create table view event listener
	      sessionRow.addEventListener('click', function(e) {
	        var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : presenterDetailWindow.tabGroup.activeTab;
	        currentTab.open(DrupalCon.ui.createSessionDetailWindow({
	          title: e.rowData.sessionTitle,
	          nid: e.rowData.nid,
	          tabGroup: currentTab
	        }), {animated:true});
	
	      });
	      
	      sessionSection.add(sessionRow);
	      
	      //tvData.push(sessionRow);
	
	    }
	    tvData.push(sessionSection);
    }
    
    if (presenterData.bio != undefined) {
      var bioSection = Ti.UI.createTableViewSection({headerTitle:'Biography'});
      var bio = Ti.UI.createLabel({
        text: cleanSpecialChars(presenterData.bio.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        height:'auto',
        width:'auto',
        left:10,
        right:10,
        top:10,
        bottom:10
      });

      bioRow.add(bio);
      bioSection.add(bioRow);
      tvData.push(bioSection);
    }

    tv.setData(tvData);
    presenterDetailWindow.add(tv);
    return presenterDetailWindow;
  };

  function getRelatedSessions(name) {
    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT nid, title FROM node WHERE instructors LIKE ? ORDER BY start_date, nid", ['%' + name + '%']);

    var nids = [];
    while(rows.isValidRow()) {
      nids.push(rows.fieldByName('nid'));
      rows.next();
    }
    rows.close();
	
    var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);

    return sessions;
  }

})();

