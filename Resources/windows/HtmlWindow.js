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
    Codestrong.ui.createHtmlWindow = function (settings) {
        Drupal.setDefaults(settings, {
            title: 'title here',
            url: ''
        });

        var htmlWindow = Titanium.UI.createWindow({
            id: 'htmlWindow',
            title: settings.title,
            backgroundColor: '#FFF',
            barColor: '#414444',
            width: '100%',
            height: '100%',
            fullscreen: false
        });
        htmlWindow.orientationModes = [Ti.UI.PORTRAIT];

        var webview = Ti.UI.createWebView({
            url: settings.url,
            width: '100%',
            height: '100%'
        });
        htmlWindow.add(webview);
        htmlWindow.addEventListener('focus', function (e) {
            webview.url = settings.url;
            webview.height = '100%';
            webview.width = '100%';
        });

        return htmlWindow;
    };

})();