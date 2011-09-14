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
        var data = [
        	{
	            title: 'Codestrong',
	            view: Ti.UI.createWebView({
	                url: 'pages/about.html'
	            })
        	}, 
        	{
	            title: 'The App',
	            view: Ti.UI.createWebView({
	                url: 'pages/app.html'
	            })
        	}
        ];
        
        aboutWindow.add(Codestrong.ui.createTabbedScrollableView({data:data}));
        
        return aboutWindow;
    };
})();