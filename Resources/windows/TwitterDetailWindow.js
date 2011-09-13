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
(function () {
    // Using the parsing method shown https://gist.github.com/819929
    var TwitterParser = function (text) {
        var html = text;
        var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
        var hashTagRegex = /#([^ ]+)/gi;
        var atTagRegex = /\@([a-z]+)/ig;

        this.linkifyURLs = function () {
            html = html.replace(urlRegex, '<a href="$1">$1</a>');
        };
        this.linkifyHashTags = function () {
            html = html.replace(hashTagRegex, '<a href="http://twitter.com/#!/search?q=%23$1">#$1</a>');
        };
        this.linkifyAtTags = function () {
            html = html.replace(atTagRegex, '<a href="http://mobile.twitter.com/$1">@$1</a>');
        };

        this.getHTML = function () {
            return html;
        };
    };

    DrupalCon.ui.createTwitterDetailWindow = function (settings) {
        Drupal.setDefaults(settings, {
            title: 'title here',
            uid: '',
            name: ''
        });

        var twitterDetailWindow = Titanium.UI.createWindow({
            id: 'twitterDetailWindow',
            title: settings.title,
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });
        twitterDetailWindow.orientationModes = [Ti.UI.PORTRAIT];
        var baseHTMLStart = '<html><head><link rel="stylesheet" type="text/css" href="windows/tweetWebView.css" />' + '<meta name="viewport" content="user-scalable=yes, width=device-width, initial-scale = 1.0, minimum-scale = 1.0, maximum-scale = 10.0" /> <meta name="apple-mobile-web-app-capable" content="yes" />' + '</head><body class="tweets"><div class="created-at">' + settings.date + '</div>',
            baseHTMLEnd = '<script type="text/javascript" src="windows/tweetWebView.js"></script></body></html>';
        var tweet = settings.text;
        var web = Ti.UI.createWebView({
            scalesPageToFit: true
        });
        twitterDetailWindow.add(web);

        // parse the tweet and set it as the HTML for the web view
        var parser = new TwitterParser(tweet);
        parser.linkifyURLs();
        parser.linkifyHashTags();
        parser.linkifyAtTags();
        var parsedPage = baseHTMLStart + parser.getHTML() + baseHTMLEnd;
        web.html = parsedPage;

        return twitterDetailWindow;
    };

})();