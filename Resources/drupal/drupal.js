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
 *
 * The CODESTRONG mobile companion app was based off the original work done by the team
 * at palatir.net which included:
 *
 * Larry Garfield
 * Pat Teglia
 * Jen Simmons
 *
 * This code can be located at: https://github.com/palantirnet/drupalcon_mobile
 *
 * The following Appcelerator Employees also spent time answering questions via phone calls, IRC
 * and email and contributed code to the original Drupalcon Mobile application.
 * 
 * Tony Guntharp
 * Chad Auld
 * Don Thorp
 * Marshall Culpepper
 * Stephen Tramer
 * Rick Blalock
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
    setDefaults: function (settings, defaults) {
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
Drupal.constructPrototype = function (o) {
    var f = function () {};
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
Drupal.getISODate = function (date, utc) {

    function pad(n) {
        return n < 10 ? '0' + n : n;
    }

    if (utc) {
        return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds());
    } else {
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
    }
};



Drupal.getObjectProperties = function (o) {
    var properties = [];
    var values = [];
    var prop;

    if (o.hasOwnProperty) {
        for (prop in o) {
            if (o.hasOwnProperty(prop)) {
                properties.push(prop);
                values.push(o[prop]);
            }
        }
    } else {
        for (prop in o) {
            properties.push(prop);
            values.push(o[prop]);
        }
    }
    return properties;
};

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
    _date.setMonth(Number(dateParts[1]) - 1);
    _date.setDate(Number(dateParts[2]));
    _date.setHours(Number(timeHours));
    _date.setMinutes(Number(timeSubParts[1]));
    _date.setSeconds(Number(timeSecParts[0]));
    if (timeSecParts[1]) {
        _date.setMilliseconds(Number(timeSecParts[1]));
    };

    return _date;
};

function strpos(haystack, needle, offset) {
    var i = (haystack + '').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}