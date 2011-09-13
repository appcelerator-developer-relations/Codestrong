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
    Codestrong.ui.createAboutWindow = function () {
        var aboutWindow = Titanium.UI.createWindow({
            id: 'aboutWindow',
            title: 'About',
            backgroundColor: '#FFF',
            barColor: '#414444',
            navBarHidden: false,
            fullscreen: false
        });

        // create table view data object
        var data = [
        	{
	            title: 'About Codestrong',
	            shortTitle: 'Codestrong',
	            webview: Ti.UI.createWebView({
	                url: 'pages/about.html'
	            })
        	}, 
        	{
	            title: 'About The App',
	            shortTitle: 'The App',
	            webview: Ti.UI.createWebView({
	                url: 'pages/app.html'
	            })
        	}
        ];

        var tabbedBarView = Ti.UI.createView({
            backgroundColor: '#555',
            top: 0,
            height: Codestrong.ui.tabBarHeight
        });
        var tabbedBar = Ti.UI.createView({
            top: 0,
            backgroundColor: '#000',
            height: Codestrong.ui.tabBarHeight,
            width: Ti.Platform.displayCaps.platformWidth
        });

        for (var i = 0; i < data.length; i++) {
            var myEntry = data[i];

            var tabView = Ti.UI.createView({
                backgroundImage: (i == 0) ? 'images/buttonbar/button2_selected.png' : 'images/buttonbar/button2_unselected_shadowL.png',
                height: Codestrong.ui.tabBarHeight,
                left: i * (Ti.Platform.displayCaps.platformWidth / data.length),
                right: Ti.Platform.displayCaps.platformWidth - ((parseInt(i) + 1) * (Ti.Platform.displayCaps.platformWidth / data.length)),
                index: i
            });

            var tabLabel = Ti.UI.createLabel({
                text: myEntry.shortTitle,
                textAlign: 'center',
                color: '#fff',
                height: 'auto',
                touchEnabled: false,
                font: {
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            });

            tabView.addEventListener('click', function (e) {
                if (e.source.index == 0) {
                    data[0].tabView.backgroundImage = 'images/buttonbar/button2_selected.png';
                    data[1].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowL.png';
                } else if (e.source.index == 1) {
                    data[0].tabView.backgroundImage = 'images/buttonbar/button2_unselected_shadowR.png';
                    data[1].tabView.backgroundImage = 'images/buttonbar/button2_selected.png';
                }

                for (var j = 0; j < data.length; j++) {
                    if (e.source.index == j) {
                        scrollable.scrollToView(data[j].webview);
                    }
                }
            });

            tabView.add(tabLabel);
            tabbedBar.add(tabView);
            myEntry.tabView = tabView;
        }

        var scrollable = Ti.UI.createScrollableView({
            showPagingControl: false,
            backgroundColor: '#000000',
            top: Codestrong.ui.tabBarHeight,
            views: [
            	data[0].webview, 
            	data[1].webview
            ]
        });
        scrollable.addEventListener('scroll', function (e) {
            if (e.view) {
                data[e.currentPage].tabView.fireEvent('click');
            }
        });

        aboutWindow.add(scrollable);
        tabbedBarView.add(tabbedBar);
        aboutWindow.add(tabbedBarView);

        return aboutWindow;
    };
})();