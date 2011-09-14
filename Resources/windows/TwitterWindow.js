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
(function () {
    Codestrong.ui.createTwitterWindow = function () {
        var twitterTimeout = 11000;
        var tweetCount = 50;
        var firstRun = true;
        
        var twitterWindow = Titanium.UI.createWindow({
            id: 'twitterWindow',
            title: 'Twitter News',
            backgroundColor: '#FFF',
            barColor: '#414444',
            fullscreen: false
        });

        var createTwitterTable = function (search) {
            return Ti.UI.createTableView({
                height: '100%',
                width: '100%',
                viewTitle: search
            });
        };
        var data = [{
        	title: '#codestrong',
        	view: createTwitterTable('#codestrong'),
            url: 'http://search.twitter.com/search.json?q=%23codestrong&result_type=recent&rpp=' + tweetCount,
            isSearch: true
        }, {
            title: '@appcelerator',
            view: createTwitterTable('@appcelerator'),
            url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=appcelerator&count=' + tweetCount,
            isSearch: false
        }, {
            title: '@codestrong',
            view: createTwitterTable('@codestrong'),
            url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=codestrong&count=' + tweetCount,
            isSearch: false
        }

        ];
        var loadedViews = [];
        
        twitterWindow.add(Codestrong.ui.createTabbedScrollableView({data:data}));

		// add a click handler to all twitter tables
        for (var index in data) {
            item = data[index];
            item.view.addEventListener('click', function (e) {
                Codestrong.navGroup.open(Codestrong.ui.createTwitterDetailWindow({
                    title: e.rowData.user,
                    text: e.rowData.tweet,
                    name: e.rowData.user,
                    date: e.rowData.date
                }), { animated: true });
            });
        }

        // Using the parsing method shown https://gist.github.com/819929
        var tweetWebJs = "document.body.addEventListener('touchmove', function(e) { e.preventDefault();}, false);";
        var baseHTMLStart = '<html><head></head><body>',
            baseHTMLEnd = '<script type="text/javascript">' + tweetWebJs + '</script></body></html>';

        // set this to true if you are only tracking one user
        var single = true;
        var getTweets = function (entry) {
                // create table view data object
                var tvData = [];

                var xhr = Ti.Network.createHTTPClient();
                xhr.timeout = twitterTimeout;
                xhr.open("GET", entry.url);

                xhr.onerror = function () {
                    loadedViews.push(entry.view);
                    if (loadedViews.length >= data.length) {
                        loadedViews = [];
                        Codestrong.ui.activityIndicator.hideModal();
                    }
                };

                xhr.onload = function () {
                    try {
                        var json = eval('(' + this.responseText + ')');
                        var tweets = entry.isSearch ? json.results : json;
                        for (var c = 0; c < tweets.length; c++) {
                            var tweet = tweets[c].text;
                            var user = entry.isSearch ? tweets[c].from_user : tweets[c].user.screen_name;
                            var avatarWidth = 48;
                            var avatar;
                            if (single == true && !entry.isSearch) {
                                avatar = tweets[1].user.profile_image_url;
                            } else {
                                avatar = entry.isSearch ? tweets[c].profile_image_url : tweets[c].user.profile_image_url;

                            }

                            var created_at = Codestrong.datetime.getTwitterInterval(tweets[c].created_at);
                            var bgcolor = (c % 2) === 0 ? '#fff' : '#eee';

                            var row = Ti.UI.createTableViewRow({
                                hasChild: true,
                                className: 'twitterRow',
                                backgroundColor: bgcolor,
                                height: 'auto',
                                date: created_at,
                                user: user,
                                tweet: tweet
                            });

                            // Create a vertical layout view to hold all the info labels and images for each tweet
                            var post_view = Ti.UI.createView({
                                height: 15,
                                left: 64,
                                top: 10,
                                right: 5
                            });

                            var av = Ti.UI.createImageView({
                                image: avatar,
                                left: 10,
                                top: 10,
                                height: 48,
                                width: avatarWidth
                            });
                            row.add(av);

                            var user_label = Ti.UI.createLabel({
                                text: user,
                                left: 0,
                                width: 120,
                                top: -3,
                                height: 20,
                                textAlign: 'left',
                                color: '#444444',
                                font: {
                                    fontFamily: 'Trebuchet MS',
                                    fontSize: 14,
                                    fontWeight: 'bold'
                                }
                            });
                            post_view.add(user_label);

                            var date_label = Ti.UI.createLabel({
                                text: created_at,
                                right: 20,
                                top: -2,
                                height: 20,
                                textAlign: 'right',
                                width: 110,
                                color: '#444444',
                                font: {
                                    fontFamily: 'Trebuchet MS',
                                    fontSize: 12
                                }
                            });
                            post_view.add(date_label);
                            row.add(post_view);

                            var tweet_text = Ti.UI.createLabel({
                                text: tweet,
                                left: 64,
                                top: 30,
                                right: 20,
                                color: '#333',
                                height: 'auto',
                                textAlign: 'left',
                                bottom: 10,
                                font: {
                                    fontSize: 14
                                }
                            });

                            // Add the tweet to the view
                            row.add(tweet_text);
                            tvData[c] = row;
                        }

                        entry.view.setData(tvData);
                        loadedViews.push(entry.view);
                        if (loadedViews.length >= data.length) {
                            loadedViews = [];
                            Codestrong.ui.activityIndicator.hideModal();
                        }
                    } catch (e) {
                        Ti.API.info(e);
                    }
                };
                // Get the data
                xhr.send();
            }

        var reloadAllTweets = function () {
                Codestrong.ui.activityIndicator.showModal('Loading latest tweets...', twitterTimeout, 'Twitter timed out. All streams may not have updated.');
                for (var i = 0; i < data.length; i++) {
                    getTweets(data[i]);
                }
            };

        // Get the tweets for 'twitter_name'
        if (Ti.Network.online) {
            twitterWindow.addEventListener('open', function (e) {
                if (firstRun) {
                    firstRun = false;
                    reloadAllTweets();
                }
            });

            if (Codestrong.isAndroid()) {
                twitterWindow.activity.onCreateOptionsMenu = function (e) {
                    var menuitem = e.menu.add({
                        title: 'Refresh Tweets'
                    });
                    menuitem.addEventListener('click', function (e) {
                        reloadAllTweets();
                    });
                };
            } else {
                var button = Ti.UI.createButton({
                    systemButton: Ti.UI.iPhone.SystemButton.REFRESH
                });
                button.addEventListener('click', function (e) {
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