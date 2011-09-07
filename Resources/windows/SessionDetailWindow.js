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

  DrupalCon.ui.createSessionDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      nid: ''
    });
    var commonPadding = 15;
    var sessionDetailWindow = Titanium.UI.createWindow({
      id: 'sessionDetailWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      barColor: '#414444'
    });

    // Build session data
    //Ti.API.debug(settings.nid);
    var sessionData = Drupal.entity.db('main', 'node').load(settings.nid);
    
    // Build the page:
    var tvData = [];
    var blueBg = '#FFF';

    // Structure
    var tv = Ti.UI.createTableView({
      textAlign: 'left',
      layout:'vertical',
      separatorColor:'#fff'
    });
    tv.footerView = Ti.UI.createView({
    	height:1,
    	opacity:0
    });
    
    var headerRow = Ti.UI.createTableViewRow({
      height: 'auto',
      backgroundColor: blueBg,
      left: 0,
      top: -5,
      bottom: 10,
      layout: 'vertical',
      className: 'headerRow',
      backgroundImage:'images/sessionbckgd@2x.png',
      backgroundPosition:'bottom left',
      selectionStyle:'none'
    });

    var bodyRow = Ti.UI.createTableViewRow({
      hasChild: false,
      height: 'auto',
      backgroundColor: blueBg,
      left: 0,
      top: -5,
      bottom: 10,
      layout: 'vertical',
      className: 'bodyRow',
      selectionStyle:'none'
    });

    if (sessionData.title) {
      var titleLabel = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.title),
        font: {fontSize: 28, fontWeight: 'bold'},
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
      //var startDate = parseISO8601(sessionData.start_date + ':00');
      var matches = /^(\d{4})\-(\d{2})\-(\d{2})/.exec(sessionData.start_date);
      var startDate = new Date(matches[1], matches[2]-1, matches[3]);
      var datetime = Ti.UI.createLabel({
        text: cleanDate(startDate) + ', ' + cleanTime(sessionData.start_date),
        font: {fontSize: 18, fontWeight: 'normal'},
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

    // Don't show a room for Lunch and Break, since what's on the web site is
    // actually completely wrong. It's hacked in for the site display, but
    // wrong for the mobile app.  We do want to show rooms for the keynotes,
    // however, which is why we can't jus exclude schedule_items.
    var skipRoom;
    if (sessionData.title === 'Lunch' || sessionData.title === 'Break' || sessionData.title.indexOf('Party') !== -1) {
      skipRoom = true;
    }

    if (sessionData.room && !skipRoom) {
      var room = Ti.UI.createLabel({
        text: sessionData.room, //sessionData.room.map(cleanSpecialChars).join(', '),
        font: {fontSize: 18, fontWeight: 'normal'},
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
        text: cleanSpecialChars(sessionData.body.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        height: 'auto',
        width: isAndroid() ? '92%' : 'auto',
        top: 15,
        bottom: 15,
        font: {
        	fontSize:16
        }
      });
      bodyRow.add(body);
    }
    
    if (!isAndroid()) {
      	body.right = commonPadding;
      	body.left = commonPadding;
    }

    if (sessionData.core_problem) {
      var problemTitle = Ti.UI.createLabel({
        text:"Problem:",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: commonPadding,
        top: 10,
        bottom: 'auto',
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(problemTitle);

      var coreProblem = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.core_problem.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: commonPadding,
        top: 5,
        bottom: 10,
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(coreProblem);
    }

    if (sessionData.core_solution) {
      var solutionTitle = Ti.UI.createLabel({
        text:"Solution:",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: commonPadding,
        top: 10,
        bottom: 'auto',
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(solutionTitle);

      var coreSolution = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.core_solution.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: commonPadding,
        top: 5,
        bottom: 10,
        right: commonPadding,
        height: 'auto'
      });
      bodyRow.add(coreSolution);
    }

    tvData.push(headerRow);
    
    //if (sessionData.instructors && sessionData.instructors.length) {
    if (sessionData.instructors) {
      var instructorList = sessionData.instructors.split(",");
      var speakerSection = Ti.UI.createTableViewSection({
      	headerTitle: (instructorList.length > 1) ? 'Speakers' : 'Speaker'	
      });
      
      for (var k = 0; k < instructorList.length; k++) {
      	instructorList[k] = instructorList[k].replace(/^\s+|\s+$/g, '');
      }
    	
      // Get the presenter information.
      var presenterData = Drupal.entity.db('main', 'user').loadByField('full_name', instructorList);//sessionData.instructors);

      for (var j in presenterData) {
      	speakerSection.add(renderPresenter(presenterData[j]));
        //tvData.push(renderPresenter(presenterData[j]));
      }
      tvData.push(speakerSection);
    }

    

    if (sessionData.type === 'session') {
      var feedbackTitle = Ti.UI.createLabel({
        text:"Rate this session",
        backgroundColor:'#3782a8',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#fff',
        left: commonPadding,
        right: commonPadding,
        height: 50
      });

      var feedbackRow = Ti.UI.createTableViewRow({
        hasChild: true,
        layout:'vertical',
        height: 50,
        className: 'feedbackRow',
        backgroundColor:'#3782A9'
      });
      feedbackRow.add(feedbackTitle);

      feedbackRow.addEventListener('click', function(e) {
        // var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : sessionDetailWindow.tabGroup.activeTab;
        // currentTab.open(DrupalCon.ui.createFeedbackWindow({
          // title: settings.title,
          // address: 'http://chicago2011.drupal.org/node/add/eval/' + settings.nid
        // }), {animated:true});
      });

      tvData.push(feedbackRow);
    }

	var bodySection = Ti.UI.createTableViewSection({headerTitle:'Description'});
	bodySection.add(bodyRow);
    tvData.push(bodySection);

    if (sessionData.audience) {
      var audienceRow = Ti.UI.createTableViewRow({height: 'auto', className: 'audienceRow', borderColor: '#fff'});

      var textViewBottom = Ti.UI.createView({
        height: 'auto',
        layout: 'vertical',
        backgroundColor: '#fff',
        textAlign: 'left',
        color: '#000',
        left: commonPadding,
        right: commonPadding
      });

      var audienceTitle = Ti.UI.createLabel({
        text:"Intended Audience",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: 0,
        top: 20,
        bottom: 0,
        right: commonPadding,
        height: 'auto'
      });
      textViewBottom.add(audienceTitle);

      var audience = Ti.UI.createLabel({
        text:sessionData.audience.replace('\n','\n\n'),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        height:'auto',
        width:'auto',
        left:0,
        right:0,
        top:10,
        bottom:15
      });

      textViewBottom.add(audience);
      audienceRow.add(textViewBottom);
      tvData.push(audienceRow);
    }

    tv.addEventListener('click', function(e) {
      if (e.source.presenter != undefined){
        var fullName = e.source.presenter.full_name || '';
        Drupal.navGroup.open(DrupalCon.ui.createPresenterDetailWindow({
          title: fullName,
          uid: e.source.presenter.uid
        }), {animated:true});
      }
    });    
    tv.setData(tvData);
    sessionDetailWindow.add(tv);

    return sessionDetailWindow;
  };

  function renderPresenter(presenter) {
	var userPict = presenter.picture.replace(/^\s+|\s+$/g, '') || 'images/userpict-large.png';

    var av = Ti.UI.createImageView({
      image:userPict,
      left:5,
      top:5,
      height:50,
      width:50,
      defaultImage:'images/userpict-large.png',
      backgroundColor: '#000'
    });

    var presRow = Ti.UI.createTableViewRow({
      presenter: presenter,
      height: 60,
      className: 'presenterRow',
      borderColor: '#C4E2EF',
      hasChild: true,
      //backgroundColor: '#fff',
      backgroundColor: '#CE3016',
      layout:'vertical'
    });
    presRow.add(av);
    var presenterFullName2 = Ti.UI.createLabel({
      presenter: presenter,
      text: cleanSpecialChars(presenter.full_name),
      font: {fontSize:18, fontWeight:'bold'},
      left: 75,
      top: -45,
      height: 'auto',
      color: '#fff'
    });
    dpm(presenter.full_name);
    var presenterName2 = Ti.UI.createLabel({
      presenter: presenter,
      text: cleanSpecialChars(presenter.company),
      font:{fontSize:14, fontWeight:'normal'},
      left: 75,
      bottom: 10,
      height: 'auto',
      color: "#fff"
    });

    presRow.add(presenterFullName2);
    presRow.add(presenterName2);

    return presRow;
  }

})();

