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

// Declaring variables to prevent implied global error in jslint
var Ti;

// Check for new tweets
setInterval (function() {
  var screen_name = 'appcelerator';
  var net = Titanium.Network;
  var up = net.online;
  
  // Only check if the network is up.
  if (up) {
    Ti.API.info("In the up portion of the setInterval twitter check.");
    var xhr = Ti.Network.createHTTPClient();
    xhr.timeout = 1000;
    xhr.open("GET","http://api.twitter.com/1/statuses/user_timeline.json?screen_name="+screen_name+"&count=1");
    xhr.onload = function() {
      try {
        var tweets = eval('('+this.responseText+')');
        for (var c=0;c<tweets.length;c++){
          var tweet = tweets[c].text;
        }
        // Updated?  Then tell the world about it!
        var lastTweet = Titanium.App.Properties.getString("lastTweet");
        if (tweet != lastTweet) {
          var n = Ti.UI.createNotification({message: "New @drupalcon tweets!"});
          n.duration = Ti.UI.NOTIFICATION_DURATION_LONG;
          n.offsetX = 50;
          n.offsetY = 25;
          n.show();
        }
   	Titanium.App.Properties.setString("lastTweet", tweet);
      }
      catch(e) {
        Ti.API.info(e);
      }
    };
    xhr.send();
  }
},1000);