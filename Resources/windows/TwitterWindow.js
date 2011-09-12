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

var Twitter = {
  ui: {},
  util: {}
};

(function() {
	var twitterTimeout = 10000;
  var tweetCount = 50;
	var firstRun = true;

  var createTwitterTable = function(search) {
  	  return Ti.UI.createTableView({
  	  	  height:'100%',
          width:'100%',
          viewTitle:search
  	  });
  }
  var data = [
  {
  		search:'#codestrong',
  		url: 'http://search.twitter.com/search.json?q=%23codestrong&result_type=recent&rpp=' + tweetCount,
  		table: createTwitterTable('#codestrong'),
  		isSearch: true
  },
    {
  		search:'@appcelerator',
  		url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=appcelerator&count=' + tweetCount,
  		table: createTwitterTable('@appcelerator'),
  		isSearch: false
  	},
  	{
  		search:'@codestrong',
  		url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=codestrong&count=' + tweetCount,
  		table: createTwitterTable('@codestrong'),
  		isSearch: false
  	}
  	
  ];
  var loadedViews = [];
  
  DrupalCon.ui.createTwitterWindow = function() {
    var twitterWindow = Titanium.UI.createWindow({
      id: 'twitterWindow',
      title: 'Twitter News',
      backgroundColor: '#FFF',
      barColor: '#414444',
      fullscreen: false
    });
    var tabbedBarView = Ti.UI.createView({
    	backgroundColor:'#555',
    	top:0,
    	height:36
    });
    var tabbedBar = Ti.UI.createView({
    	top:0,
    	backgroundColor: '#000',
    	height:36,
    	width:Ti.Platform.displayCaps.platformWidth
    });
    
    for (var index in data) {
    	myEntry = data[index];
  		myEntry.table.addEventListener('click', function(e) {
  			Codestrong.navGroup.open(DrupalCon.ui.createTwitterDetailWindow({
      			title: e.rowData.user,
      			text: e.rowData.tweet,
      			name: e.rowData.user,
      			date: e.rowData.date
    		}), {animated:true});
		});
		
		var bgImage = 'images/buttonbar/button2_selected.png';
		if (index == 1) {
			bgImage = 'images/buttonbar/button2_unselected_shadowL.png';
		} else if (index == 2) {
			bgImage = 'images/buttonbar/button2_unselected_shadowR.png';
		}
		
		var tabView = Ti.UI.createView({
			backgroundImage: bgImage,
			height:36,
			left: index * (Ti.Platform.displayCaps.platformWidth/data.length),
			right: Ti.Platform.displayCaps.platformWidth - ((parseInt(index) + 1) * (Ti.Platform.displayCaps.platformWidth/data.length)),
			index: index
		});
		
		var tabLabel = Ti.UI.createLabel({
			text: myEntry.search,
			textAlign:'center',
			color: '#fff',
			height:'auto',
			touchEnabled: false,
			font: {
				fontSize:14	
			}
		});
		tabView.addEventListener('click', function(e) {
			for (var i = 0; i < data.length; i++) {
				if (e.source.index == 0) {
					data[0].tabView.backgroundImage = 'images/buttonbar/button2_selected.png';
					data[1].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowL.png';
					data[2].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowR.png';
				} else if (e.source.index == 1) {
					data[0].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowR.png';
					data[1].tabView.backgroundImage = 'images/buttonbar/button2_selected.png';
					data[2].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowL.png';
				} else if (e.source.index == 2) {
					data[0].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowL.png';
					data[1].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowR.png';
					data[2].tabView.backgroundImage = 'images/buttonbar/button2_selected.png';
				}
				
				if (e.source.index == i) {
					scrollable.scrollToView(data[i].table);
				}
			}
		});
		
		tabView.add(tabLabel);
        tabbedBar.add(tabView);
        myEntry.tabView = tabView;
    }
     
    var scrollable = Ti.UI.createScrollableView({
		showPagingControl: true,
		backgroundColor: '#000000',
		top:30,
		views:[
			data[0].table,
			data[1].table,
			data[2].table
		]
	});
	scrollable.addEventListener('scroll', function(e) {
		if (e.view) {
			data[e.currentPage].tabView.fireEvent('click');
		}
	});

	twitterWindow.add(scrollable);
	tabbedBarView.add(tabbedBar);	
	twitterWindow.add(tabbedBarView);

    // Using the parsing method shown https://gist.github.com/819929
    var tweetWebJs = "document.body.addEventListener('touchmove', function(e) { e.preventDefault();}, false);";
    var baseHTMLStart = '<html><head></head><body>',
        baseHTMLEnd = '<script type="text/javascript">' + tweetWebJs + '</script></body></html>';

    // set this to true if you are only tracking one user
    var single = true;
    var getTweets = function(entry) {
      // create table view data object
      var tvData = [];

      var xhr = Ti.Network.createHTTPClient();
      xhr.timeout = twitterTimeout;
      xhr.open("GET", entry.url);
      
      xhr.onerror = function() {
      	  loadedViews.push(entry.table);
          if (loadedViews.length >= data.length) {
			loadedViews = [];
			DrupalCon.ui.activityIndicator.hideModal();
          }
      };
      
      xhr.onload = function() {
        try {
          var json = eval('('+this.responseText+')');
          var tweets = entry.isSearch ? json.results : json;
          for (var c=0;c<tweets.length;c++) {
            var tweet = tweets[c].text;
            var user = entry.isSearch ? tweets[c].from_user : tweets[c].user.screen_name;
            var avatarWidth = 48;
            var avatar;
            if (single ==  true && !entry.isSearch) {
              avatar = tweets[1].user.profile_image_url;
            }
            else {
              avatar = entry.isSearch ? tweets[c].profile_image_url : tweets[c].user.profile_image_url;

            }
            var created_at = prettyDate(strtotime(tweets[c].created_at));
            var bgcolor = (c % 2) === 0 ? '#fff' : '#eee';

            var row = Ti.UI.createTableViewRow({
              hasChild:true,
              className: 'twitterRow',
              backgroundColor:bgcolor,
              height:'auto',
              date:created_at,
              user:user,
              tweet:tweet
            });

            // Create a vertical layout view to hold all the info labels and images for each tweet
            var post_view = Ti.UI.createView({
              height:15,
              left:64,
              top:10,
              right:5
            });

            var av = Ti.UI.createImageView({
              image:avatar,
              left:10,
              top:10,
              height:48,
              width:avatarWidth
            });
            row.add(av);

            var user_label = Ti.UI.createLabel({
              text:user,
              left:0,
              width:120,
              top:-3,
              height:20,
              textAlign:'left',
              color:'#444444',
              font:{
                fontFamily:'Trebuchet MS',
                fontSize:14,
                fontWeight:'bold'
              }
            });
            post_view.add(user_label);

            var date_label = Ti.UI.createLabel({
              text:created_at,
              right:20,
              top:-2,
              height:20,
              textAlign:'right',
              width:110,
              color:'#444444',
              font:{
                fontFamily:'Trebuchet MS',
                fontSize:12
              }
            });
            post_view.add(date_label);
            row.add(post_view);

            var tweet_text = Ti.UI.createLabel({
              text:tweet,
              left:64,
              top:30,
              right:20,
              color:'#333',
              height:'auto',
              textAlign:'left',
              bottom: 10,
              font:{
                fontSize:14
              }
            });

            // Add the tweet to the view
            row.add(tweet_text);
            tvData[c] = row;
          }

          entry.table.setData(tvData);
          loadedViews.push(entry.table);
          if (loadedViews.length >= data.length) {
			loadedViews = [];
			DrupalCon.ui.activityIndicator.hideModal();
          }
        }
        catch(e) {
          Ti.API.info(e);
        }
      };
      // Get the data
      xhr.send();
    }

	var reloadAllTweets = function() {
		DrupalCon.ui.activityIndicator.showModal('Loading latest tweets...', twitterTimeout, 'Twitter timed out. All streams may not have updated.');
	  	for (var i = 0; i < data.length; i++) {
	  		getTweets(data[i]);	
	  	}
	};

    // Get the tweets for 'twitter_name'
    if (Ti.Network.online) {
    	twitterWindow.addEventListener('open', function(e) {
			if (firstRun) {
				firstRun = false;
      			reloadAllTweets();
      		}
     	});

      	if (Codestrong.isAndroid()) {
        	twitterWindow.activity.onCreateOptionsMenu = function(e) {
          		var menuitem = e.menu.add({
            		title : 'Refresh Tweets'
          		});
          		menuitem.addEventListener('click', function(e) {
            		reloadAllTweets();
          		});
        	};
      	} else {
      		var button = Ti.UI.createButton({
          		systemButton: Ti.UI.iPhone.SystemButton.REFRESH
        	}); 	
        	button.addEventListener('click', function(e) {	
          		reloadAllTweets();
        	});
        	twitterWindow.rightNavButton = button;
      	}
    } else {
    	alert('No network connection detected.');
    }

    return twitterWindow;
  };

})();

