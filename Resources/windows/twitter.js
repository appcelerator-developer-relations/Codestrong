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

// set up a twitter screen name.
var twitter_name = 'drupalcon';
var win = Titanium.UI.currentWindow;
win.title = '@'+twitter_name;

var net = Titanium.Network;
var up = net.online;

function getTweets(screen_name){
	var actInd = Titanium.UI.createActivityIndicator({
		bottom:10, 
		height:50,
		width:10,
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
	});
	actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	actInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
	actInd.color = 'white';
	actInd.message = 'Loading...';
	actInd.width = 210;
	actInd.show();


	// create table view data object
	var data = [];

	var xhr = Ti.Network.createHTTPClient();
	xhr.timeout = 1000000;
	xhr.open("GET","http://api.twitter.com/1/statuses/user_timeline.json?screen_name="+screen_name+"&count=30");
	xhr.onload = function()
	{
		try
		{
			var tweets = eval('('+this.responseText+')');
			for (var c=0;c<tweets.length;c++){

				var tweet = tweets[c].text;
				var user = tweets[c].user.screen_name;
				var avatar = tweets[c].user.profile_image_url;
				var created_at = prettyDate(strtotime(tweets[c].created_at));
				var bgcolor = (c % 2) == 0 ? '#fff' : '#eee';

				var row = Ti.UI.createTableViewRow({hasChild:false,height:'auto',backgroundColor:bgcolor});

				// Create a vertical layout view to hold all the info labels and images for each tweet
				var post_view = Ti.UI.createView({
					height:'auto',
					layout:'vertical',
					left:5,
					top:5,
					bottom:5,
					right:5
				});

				var av = Ti.UI.createImageView({
						image:avatar,
						left:0,
						top:0,
						height:48,
						width:48
					});
				// Add the avatar image to the view
				post_view.add(av);

				var user_label = Ti.UI.createLabel({
					text:user,
					left:54,
					width:120,
					top:-48,
					bottom:2,
					height:16,
					textAlign:'left',
					color:'#444444',
					font:{fontFamily:'Trebuchet MS',fontSize:14,fontWeight:'bold'}
				});
				// Add the username to the view
				post_view.add(user_label);

				var date_label = Ti.UI.createLabel({
					text:created_at,
					right:0,
					top:-18,
					bottom:2,
					height:14,
					textAlign:'right',
					width:110,
					color:'#444444',
					font:{fontFamily:'Trebuchet MS',fontSize:12}
				});
				// Add the date to the view
				post_view.add(date_label);

				var tweet_text = Ti.UI.createLabel({
					text:tweet,
					left:54,
					top:0,
					bottom:2,
					height:'auto',
					color:'#000',
					width:'auto',
					textAlign:'left',
					font:{fontSize:14}
				});
				// Add the tweet to the view
				post_view.add(tweet_text);
				// Add the vertical layout view to the row
				row.add(post_view);
				row.className = 'item'+c;
				data[c] = row;
			}
			
			Titanium.App.Properties.setString("lastTweet",tweet);
			
			// Create the tableView and add it to the window.
			var tableview = Titanium.UI.createTableView({data:data,minRowHeight:58});
			win.add(tableview);
			actInd.hide();
		}
		catch(E){
			alert(E);
		}
	};
	// Get the data
	xhr.send();
}

// creates a 'pretty date' from a unix time stamp
function prettyDate(time){
	var monthname = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var date = new Date(time*1000),
	diff = (((new Date()).getTime() - date.getTime()) / 1000),
	day_diff = Math.floor(diff / 86400);
	if ( isNaN(day_diff) || day_diff < 0 ){
		return '';
	}
	if(day_diff >= 31){
		var date_year = date.getFullYear();
		var month_name = monthname[date.getMonth()];
		var date_month = date.getMonth() + 1;
		if(date_month < 10){
			date_month = "0"+date_month;
		}
		var date_monthday = date.getDate();
		if(date_monthday < 10){
			date_monthday = "0"+date_monthday;
		}
		return date_monthday + " " + month_name + " " + date_year;
	}
	return day_diff == 0 && (
		diff < 60 && "just now" ||
		diff < 120 && "1 minute ago" ||
		diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
		diff < 7200 && "1 hour ago" ||
		diff < 86400 && "about " + Math.floor( diff / 3600 ) + " hours ago") ||
	day_diff == 1 && "Yesterday" ||
	day_diff < 7 && day_diff + " days ago" ||
	day_diff < 31 && Math.ceil( day_diff / 7 ) + " week" + ((Math.ceil( day_diff / 7 )) == 1 ? "" : "s") + " ago";
}
// Get the tweets for 'twitter_name'
if (up) {
	getTweets(twitter_name);	
}
else {
	alert("No active network connection.  Please try again when you are connected.");
}

win.activity.onCreateOptionsMenu = function(e) {
  var menu = e.menu;

  var m1 = menu.add({ title : 'Refresh Tweets' });
  m1.addEventListener('click', function(e) {
    getTweets(twitter_name);
  });
};

