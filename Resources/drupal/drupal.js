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
 */

/**
 * Main Drupal factory.
 *
 * This object serves as a central router for Drupal integration.
 */
var Drupal = {

  /**
   * Sets default values for an object.
   *
   * This is similar to jQuery.extend() or PHP's += for arrays, and can be
   * used for much the same purpose.
   *
   * @param settings
   *   The object on which to set default values.  Note that this object will
   *   be modified directly.
   * @param defaults
   *   The default values to use for each key if the settings object does not
   *   yet have a value for that key.
   * @returns
   *   The settings object.
   */
  setDefaults: function(settings, defaults) {
  	if (!settings) {
  		settings = {};	
  	}
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key) && settings[key] === undefined) {
        settings[key] = defaults[key];
      }
    }
    return settings;
  }
};

/**
 * For fancy-schmancy inheritance building.
 */
Drupal.constructPrototype = function(o) {
  var f = function() {};
  f.prototype = o.prototype;
  return new f();
};

/**
 * Format a date object ins ISO format.
 *
 * That this is missing from the Javascript date object is a crime against nature.
 *
 * @see
 *   http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
 *
 * @param {Date} date
 *   The date object we want to format.
 * @param {boolean} utc
 *   True to format the date in UTC timezone, false to use the local timezone.
 * @return {string}
 *   The ISO formatted version of the date object.
 */
Drupal.getISODate = function(date, utc) {

  function pad(n) {return n < 10 ? '0' + n : n;}

  if (utc) {
    return date.getUTCFullYear() + '-'
      + pad(date.getUTCMonth() + 1) + '-'
      + pad(date.getUTCDate()) + 'T'
      + pad(date.getUTCHours()) + ':'
      + pad(date.getUTCMinutes()) + ':'
      + pad(date.getUTCSeconds());
  }
  else {
    return date.getFullYear() + '-'
      + pad(date.getMonth() + 1) + '-'
      + pad(date.getDate()) + 'T'
      + pad(date.getHours()) + ':'
      + pad(date.getMinutes()) + ':'
      + pad(date.getSeconds());
  }
};



Drupal.getObjectProperties = function(o) {
  var properties = [];
  var values = [];
  var prop;

  // Apparently hasOwnProperty() is sometimes missing from objects in Titanium.
  // My best guess is that it's on objects deserialized from JSON, but I'm not
  // really sure.  At this point I no longer care.
  if(o.hasOwnProperty) {
    for (prop in o) {
      if (o.hasOwnProperty(prop)) {
        properties.push(prop);
        values.push(o[prop]);
      }
    }
  }
  else {
    for (prop in o) {
      properties.push(prop);
      values.push(o[prop]);
    }
  }
  return properties;
};

(function() {

  Drupal.createNoticeDialog = function(message) {
    return new Drupal.NoticeDialog(message);
  };

  Drupal.NoticeDialog = function(message) {

    var messageWin = Titanium.UI.createWindow({
      height:30,
      width:250,
      bottom:70,
      borderRadius:10,
      border: 1,
      touchEnabled:false,
      orientationModes : [
        Titanium.UI.PORTRAIT,
        Titanium.UI.UPSIDE_PORTRAIT,
        Titanium.UI.LANDSCAPE_LEFT,
        Titanium.UI.LANDSCAPE_RIGHT
      ],
      debugText: message
    });
    var messageView = Titanium.UI.createView({
      id:'messageview',
      height:30,
      width:250,
      borderRadius:10,
      backgroundColor:'#000',
      opacity:0.7,
      touchEnabled:false
    });

    var messageLabel = Titanium.UI.createLabel({
      id:'messagelabel',
      text:'',
      color:'#fff',
      width:250,
      height:'auto',
      font:{
        fontFamily:'Helvetica Neue',
        fontSize:13
      },
      textAlign:'center'
    });

    messageLabel.text = message;

    messageWin.add(messageView);
    messageWin.add(messageLabel);

    this.messageWindow = messageWin;

  };

  var openNoticeWindow;

  Drupal.NoticeDialog.prototype.show = function(time) {
    // Close any open notice windows first.
    if (openNoticeWindow) {
      openNoticeWindow.close();
    }

    this.messageWindow.open();

    openNoticeWindow = this.messageWindow;

    // Needed to avoid 'this' confusion in the callback. Blech.
    var win = this.messageWindow;
    setTimeout(function() {
      win.close({opacity:0,duration:2000});
    }, time);
  };

})();

/**
 * Parse an ISO formatted date string into a date object.
 * 
 * This functionality is supposed to be in ES5, but is apparently missing in Ti 
 * for some odd reason.
 *
 * Courtesy Xenc in #titanium_app.
 *
 * Note that this function MUST take the EXACT string:
 * YYYY-MM-DDTHH:MM:SS
 *
 * If the seconds are missing, it will fatal out and the error message on Android
 * will be on the wrong line entirely.
 *
 * @param str
 *   A string in YYYY-MM-DDTHH:MM:SS format. It must be exactly that format,
 *   including seconds.
 * @return {Date}
 */
function parseISO8601(str) {
  // Parses "as is" without attempting timezone conversion

  var parts = str.split('T');
  var dateParts = parts[0].split('-');
  var timeParts = parts[1].split('Z');
  var timeSubParts = timeParts[0].split(':');
  var timeSecParts = timeSubParts[2].split('.');
  var timeHours = Number(timeSubParts[0]);
  var _date = new Date();

  _date.setFullYear(Number(dateParts[0]));
  _date.setMonth(Number(dateParts[1])-1);
  _date.setDate(Number(dateParts[2]));
  _date.setHours(Number(timeHours));
  _date.setMinutes(Number(timeSubParts[1]));
  _date.setSeconds(Number(timeSecParts[0]));
  if (timeSecParts[1]) { _date.setMilliseconds(Number(timeSecParts[1])); };

  return _date;
};

function strpos (haystack, needle, offset) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Onno Marsman
    // +   bugfixed by: Daniel Esteban
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: strpos('Kevin van Zonneveld', 'e', 5);
    // *     returns 1: 14
    var i = (haystack + '').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}