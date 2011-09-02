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

/*
 * Check for avatars and save new ones if they don't exist.
 */
function getAvatars(picture,uid) {
  var dir = Ti.Filesystem.applicationDataDirectory;
  // Local app data directory
  var f = Ti.Filesystem.getFile(dir,'picture-'+uid+'.jpg');
  // images/avatars directory
  var adir = Ti.Filesystem.resourcesDirectory;
  var af = Ti.Filesystem.getFile(adir,'images/avatars/picture-'+uid+'.jpg');
  // If it exists in either place or if it is the default avatar, don't bother
  //if(f.exists() || af.exists() || picture == 'http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png') {
  if(f.exists() || af.exists() || picture == 'images/avatars/default-profile-pic.png') {
  }
  else {
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function() {
      f.write(this.responseData);
    };
    xhr.open('GET', picture);
    xhr.send();
  }
}

function avatarPath(uid) {
  var dir = Ti.Filesystem.applicationDataDirectory;
  // Local app data directory
  var f = Ti.Filesystem.getFile(dir,'picture-'+uid+'.jpg');
  // images/avatars directory
  var adir = Ti.Filesystem.resourcesDirectory;
  var af = Ti.Filesystem.getFile(adir,'images/avatars/picture-'+uid+'.jpg');
  var result = '';
  if(f.exists()) {
    result = dir+'/picture-'+uid+'.jpg';
  }
  else if (af.exists()) {
    if (isAndroid()) {
      result = 'images/avatars/picture-'+uid+'.jpg';
    }
    else {
      result = adir + '/images/avatars/picture-'+uid+'.jpg';
    }
  }
  else {
    result = 'images/userpict-large.png';
  }
  return result;
}
/* 
 * Build presenter data blob
 */
function getPresenterData(names) {

  // Instructors may be single (string) or multiple (object), this part works.
  var instructors = [];
  if (typeof names === 'string') {
    instructors.push(names);
  }
  else {
    // Force what is likely an object to an array.
    for (var i in names) {
      // We don't use hasOwnProperty() here because that doesn't exist for objects
      // created by JSON.parse() in Titanium. This is a Titanium bug, I believe.
      instructors.push(names[i]);
    }
  }

  var placeholders = [];
  for (var j = 0, numPlaceholders = instructors.length; j < numPlaceholders; j++) {
    placeholders.push('?');
  }

  var rows = Drupal.db.getConnection('main').query("SELECT name, full_name FROM user WHERE name IN (" + placeholders.join(', ') + ')', instructors);

  var nameList = [];
  if (rows) {
    while (rows.isValidRow()) {
      if (rows.fieldByName('full_name')) {
        nameList.push(rows.fieldByName('full_name'));
      }
      else {
        nameList.push(rows.fieldByName('name'));
      }
      rows.next();
    }
    rows.close();
  }

  return nameList;
}

// Should be in a namespace, but then again, so should pretty much all of this
var isAndroidValue = undefined;

function isAndroid (){
	if (isAndroidValue === undefined) {
		isAndroidValue = (Ti.Platform.osname == 'android');
	} 
	return isAndroidValue;
}

/*
 * Cleans up the timestamp and makes it in the format of 1:30PM
 */
function cleanTime(time) {
  var shortTime = time.substr(11,5);
  var mins = shortTime.substr(2,5);
  var hour = parseFloat(shortTime.slice(0,2));
  var ampm = 'AM';
  // Assume that 12 means noon, not midnight.
  if (hour == 12) {
    ampm = 'PM';
  }
  else if (hour >= 12) {
    hour -= 12;
    ampm = 'PM';
  }
  return hour + "" + mins + "" + ampm;
}

function dpm(vars) {
  Ti.API.info(vars);
}


// Using the parsing method shown https://gist.github.com/819929
/**
 * Define our parser class. It takes in some text, and then you can call "linkifyURLs", or one of the other methods,
 * and then call "getHTML" to get the fully parsed text back as HTML!
 * @param text that you want parsed
 */
function twitterParser(text) {

  var html = text;

  var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
  var hashTagRegex = /#([^ ]+)/gi;
  var atTagRegex = /\@([a-z]+)/ig;

  this.linkifyURLs = function() {
    html = html.replace(urlRegex, '<a href="$1">$1</a>');
    // html = html.replace(urlRegex, '<a onclick="Ti.App.fireEvent(\'openURL\', { url: \'$1\' });">$1</a>');
  };
  this.linkifyHashTags = function() {
    html = html.replace(hashTagRegex, '<a href="http://twitter.com/#!/search?q=%23$1">#$1</a>');
  };
  this.linkifyAtTags = function() {
    //dpm(atTagRegex);
    html = html.replace(atTagRegex, '<a href="http://mobile.twitter.com/$1">@$1</a>');
  };

  this.getHTML = function() {
    return html;
  };

}


/*
 * Clean up some of the special characters we are running into.
 */
function cleanSpecialChars(str) {
  // Because otherwise the code below would explode.
  if (str == null) {
    return '';
  }

  if (typeof str === 'string') {
    return  str
      .replace(/&quot;/g,'"')
      .replace(/\&amp\;/g,"&")
      .replace(/&lt;/g,"<")
      .replace(/&gt;/g,">")
      .replace(/&#039;/g, "'");
  }

  return '';
}

/**
 * Creates a "pretty date" from a Unix time stamp.
 *
 * @param {integer} time
 *   The timestamp to format.
 * @return {string}
 *   The timestamp formatted in "time ago" format.
 */
function prettyDate(time) {
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
  return day_diff === 0 && (
    diff < 60 && "just now" ||
    diff < 120 && "1 minute ago" ||
    diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
    diff < 7200 && "1 hour ago" ||
    diff < 86400 && "about " + Math.floor( diff / 3600 ) + " hours ago") ||
  day_diff == 1 && "Yesterday" ||
  day_diff < 7 && day_diff + " days ago" ||
  day_diff < 31 && Math.ceil( day_diff / 7 ) + " week" + ((Math.ceil( day_diff / 7 )) == 1 ? "" : "s") + " ago";
}

function dayToName(day) {
  switch (day) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
  }
}

function monthToName(month) {
  switch (month) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
  }
}

/**
 * Format a date string.
 *
 * @param {Date} date
 *   A Date() object to format.
 */
function cleanDate(date) {
  var label;
  switch (date.getDate()) {
    case 1:
      label = 'st';
      break;
    case 2:
      label = 'nd';
      break;
    default:
      label = 'th';
  }

  return dayToName(date.getDay()) + ', ' + monthToName(date.getMonth()+1) + ' ' +  date.getDate() + label;
}
