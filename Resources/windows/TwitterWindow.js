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
  var tweetCount = 50;
  var viewsToLoad = [
    {
  		search:'@appcelerator',
  		url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=appcelerator&count=' + tweetCount
  	},
  	{
  		search:'@codestrong',
  		url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=codestrong&count=' + tweetCount
  	},
  	{
  		search:'#codestrong',
  		url: 'http://search.twitter.com/search.json?q=%23codestrong&result_type=recent&rpp=' + tweetCount
  	}
  ];
  var loadedViews = [];
  
  DrupalCon.ui.createTwitterWindow = function(tabGroup) {
    var twitterWindow = Titanium.UI.createWindow({
      id: 'twitterWindow',
      title: 'News',
      backgroundColor: '#FFF',
      barColor: '#414444',
      tabGroup: tabGroup
    });

    // Using the parsing method shown https://gist.github.com/819929
    var tweetWebJs = "document.body.addEventListener('touchmove', function(e) { e.preventDefault();}, false);";
    var baseHTMLStart = '<html><head></head><body>',
        baseHTMLEnd = '<script type="text/javascript">' + tweetWebJs + '</script></body></html>';

    // set up a twitter screen name.
    var twitter_name = 'appcelerator';
    twitterWindow.title = '@' + twitter_name;

    // set this to true if you are only tracking one user
    var single = true;

    var net = Titanium.Network;
    var up = net.online;

    var getTweets = function(entry) {
      var actInd = Titanium.UI.createActivityIndicator({
        bottom:10,
        height:50,
        width:10,
        style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
      });
      actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
      actInd.font = {
        fontFamily:'Helvetica Neue',
        fontSize:15,
        fontWeight:'bold'
      };
      actInd.color = 'white';
      actInd.message = 'Loading...';
      actInd.width = 210;
      actInd.show();

      // create table view data object
      var data = [];

      var xhr = Ti.Network.createHTTPClient();
      xhr.timeout = 100000;
      xhr.open("GET", entry.url);
      
      xhr.onload = function() {
        try {
          var json = eval('('+this.responseText+')');
          var isSearch = (entry.search.charAt(0) != '@');
          var tweets = isSearch ? json.results : json;
          for (var c=0;c<tweets.length;c++) {
            var tweet = tweets[c].text;
            var user = isSearch ? tweets[c].from_user : tweets[c].user.screen_name;
            var avatarWidth = 48;
            var avatar;
            if (single ==  true && !isSearch) {
              avatar = tweets[1].user.profile_image_url;
            }
            else {
              avatar = isSearch ? tweets[c].profile_image_url : tweets[c].user.profile_image_url;

            }
            var created_at = prettyDate(strtotime(tweets[c].created_at));
            var bgcolor = (c % 2) === 0 ? '#fff' : '#eee';

            var row = Ti.UI.createTableViewRow({
              hasChild:true,
              backgroundColor:bgcolor,
              height:'auto',
              date:created_at
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
            // Add the avatar image to the view
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
            // Add the username to the view
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
            // Add the date to the view
            post_view.add(date_label);
            // Add the vertical layout view to the row
            row.add(post_view);

            var tweet_text = Ti.UI.createLabel({
              text:tweet,
              left:64,
              top:30,
              right:20,
              color:'#333',
              width:'auto',
              height:'auto',
              textAlign:'left',
              bottom: 10,
              font:{
                fontSize:14
              }
            });

            // Add the tweet to the view
            row.add(tweet_text);
            data[c] = row;
          }

          Titanium.App.Properties.setString("lastTweet",tweet);

          // Create the tableView and add it to the window.
          var tableview = Titanium.UI.createTableView({
            data:data,
            height:'100%',
            width:'100%',
            viewTitle:entry.search
          });
          //twitterWindow.add(tableview);
          //scrollable.addView(tableview);
          loadedViews.push(tableview);
          if (loadedViews.length == viewsToLoad.length) {
          	var scrollable = Ti.UI.createScrollableView({
				showPagingControl: true,
				backgroundColor: '#000000',
				height:'100%',
				width:'100%',
				views:loadedViews
			});
			scrollable.addEventListener('scroll', function(e) {
				if (e.view) {
					twitterWindow.title = e.view.viewTitle;
				}
			});
			twitterWindow.add(scrollable);
          }
          actInd.hide();


          // create table view event listener
          tableview.addEventListener('click', function(e) {

            var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : twitterWindow.tabGroup.activeTab;
            currentTab.open(DrupalCon.ui.createTwitterDetailWindow({
              title: isSearch ? tweets[e.index].from_user : tweets[e.index].user.screen_name,
              text: tweets[e.index].text,
              name: isSearch ? tweets[e.index].from_user : tweets[e.index].user.screen_name,
              date: e.rowData.date,
              tabGroup: currentTab
            }), {animated:true});
          });
        }
        catch(e) {
          Ti.API.info(e);
        }
      };
      // Get the data
      xhr.send();
    }

	var reloadAllTweets = function() {
	  	for (var i = 0; i < viewsToLoad.length; i++) {
	  		getTweets(viewsToLoad[i]);	
	  	}
	  };

    // Get the tweets for 'twitter_name'
    if (up) {
      reloadAllTweets();

      if (Ti.Platform.name == 'android') {
        twitterWindow.activity.onCreateOptionsMenu = function(e) {
          var menu = e.menu;

          var m1 = menu.add({
            title : 'Refresh Tweets'
          });
          m1.addEventListener('click', function(e) {
            reloadAllTweets();
          });
        };
      }
      else {
        //create iphone menu.
        var index = 0;
        var button = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.REFRESH

        });
        twitterWindow.rightNavButton = button;
        button.addEventListener('click', function(e) {
          reloadAllTweets();
        });
      }
    }
    else {
      Ti.API.info("No active network connection.  Please try again when you are connected.");
    }

    return twitterWindow;
  };

})();

