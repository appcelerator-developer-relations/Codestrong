/**
 * This file is part of  CODESTRONG Mobile.
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
 * along with DrupalCon Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {

  DrupalCon.ui.createHtmlWindow = function(settings, tabGroup) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      tabGroup: undefined,
      url: ''
    });

    var htmlWindow = Titanium.UI.createWindow({
      id: 'htmlWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      width: 'auto',
      height: 'auto',
      tabGroup: tabGroup
    });
    
    htmlWindow.add(Ti.UI.createWebView({
      url: settings.url
    }));

    return htmlWindow;
  };

})();
