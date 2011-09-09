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
var Ti, Titanium, Drupal, desc, menu, refresh, logout;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#414444');

// Include the Drupal connection libraries.
Ti.include(
  'lib/phpjs.js',
  'lib/misc.js',
  'lib/menu.js',
  'drupal/drupal.js',
  'drupal/services.js',
  'drupal/db.js',
  'drupal/db.insert.js',
  'drupal/entity.js',
  'drupal/entity.datastore.js',
  'drupalcon/drupalcon.js',
  'drupalcon/entity.js'
);

// Define our connection information.  This is very similar to the DB layer's
// $databases array in settings.php.
Drupal.services.addConnectionInfo('main', {
  endpointUrl: 'http://chicago2011.drupal.org/services/mobile',
  user: '',
  pass: ''
});

// Register our database information.
Drupal.db.addConnectionInfo('main');
Ti.Database.install('main.sql', 'main');

// If we haven't created the tables yet, make empty ones to ensure that the
// app doesn't crash.
if (!Drupal.db.getConnection('main').tableExists('node')) {
  Drupal.entity.db('main', 'node').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('user')) {
  Drupal.entity.db('main', 'user').initializeSchema();
}

Ti.include('lib/Codestrong.js');

Ti.include(
  'windows/ModalActivityIndicatorWindow.js',	
  'windows/DayWindow.js',
  'windows/TwitterWindow.js',
  'windows/MapWindow.js',
  'windows/AboutWindow.js',
  'windows/TwitterDetailWindow.js',
  'windows/PresentersWindow.js',
  'windows/SessionsWindow.js',
  'windows/SessionDetailWindow.js',
  'windows/PresenterDetailWindow.js',
  'windows/HtmlWindow.js'
);

Ti.include('windows/main.js');

// open URLs in the native browser, not a webview
Ti.App.addEventListener('openURL', function(e){
  Ti.Platform.openURL(e.url);
});
