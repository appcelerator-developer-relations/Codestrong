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
Titanium.UI.setBackgroundColor('#000');

// Include the Drupal connection libraries.
Ti.include(
  'lib/phpjs.js',
  'lib/misc.js',
  'lib/menu.js',
  'drupal/drupal.js',
  'drupal/services.js',
  'drupal/db.js',
  'drupal/entity.js',

  'drupalcon/drupalcon.js',
  'drupalcon/entity.js'
  // "lib/twitter_services.js"
);

//Ti.include('drupalcon/entity.js');

// Define our connection information.  This is very similar to the DB layer's
// $databases array in settings.php.
Drupal.services.addConnectionInfo('main', {
  endpointUrl: 'http://chicago2011.drupal.org/services/mobile',
  user: '',
  pass: ''
});

// Register our database information.
Drupal.db.addConnectionInfo('main');

// Pre-create the database.  This is a snapshot of the dataset taken shortly
// prior to shipping.
Ti.Database.install('main.sql', 'main');

// If we haven't created the tables yet, make empty ones to ensure that the
// app doesn't crash.
if (!Drupal.db.getConnection('main').tableExists('node')) {
  Drupal.entity.db('main', 'node').initializeSchema();
}
if (!Drupal.db.getConnection('main').tableExists('user')) {
  Drupal.entity.db('main', 'user').initializeSchema();
}

// If there's no record of having synchronized data with the site before, default
// to 15 Feb as the oldest to pull from.  That avoids ever downloading the entire
// site, since we have a pre-loaded database.
if ('' == Titanium.App.Properties.getString('drupalcon:fetcher:lastNodeUpdate:session', '')) {
  Titanium.App.Properties.setString('drupalcon:fetcher:lastNodeUpdate:session', '2011-02-28T12:00:00');
}

// This is just for testing purposes. In practice we wouldn't
// actually want to wipe the DB on every app start. :-)
//Drupal.entity.db('main', 'node').initializeSchema();
//Drupal.entity.db('main', 'user').initializeSchema();


// Download tests, for now.  These must get moved eventually.
//Drupal.db.errorMode = Drupal.db.ERROR_LEVEL_DEBUG;

Ti.include(
  'windows/DayWindow.js',
  'windows/MapWindow.js',
  'windows/MapDetailWindow.js',
  'windows/TwitterWindow.js',
  'windows/TwitterDetailWindow.js',
  'windows/StarredWindow.js',
  'windows/FeedbackWindow.js',
  'windows/PresentersWindow.js',
  'windows/SessionsWindow.js',
  'windows/SessionDetailWindow.js',
  'windows/PresenterDetailWindow.js',
  'windows/HtmlWindow.js'
);

Ti.include('windows/main.js');

Ti.App.addEventListener('openURL', function(e){
  Ti.Platform.openURL(e.url);
});

/*
// Download tests, for now.  These must get moved eventually.
Drupal.db.errorMode = Drupal.db.ERROR_LEVEL_DEBUG;

// This is just for testing purposes. In practice we wouldn't
// actually want to wipe the DB on every app start. :-)
var store = Drupal.entity.db('main', 'node').initializeSchema();

//Drupal.entity.db('main', 'node').fetchUpdates('session');

//Drupal.entity.mirror('main', 'node', 464);

// This will actually not have the updated number of records,
// since the mirror request is asynchronous.
//Ti.API.info('Number of nodes on file: ' + Drupal.entity.db('main', 'node').connection.query("SELECT COUNT(*) FROM node").field(0));
*/
