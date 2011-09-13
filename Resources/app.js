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

// Declaring variables to prevent implied global error in jslint
var Ti, Drupal;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Ti.UI.setBackgroundColor('#414444');

Ti.include(
	// Codestrong libraries
	'cs/cs.js',
	'cs/ui.js',
	'cs/datetime.js',
	
	// Drupal connection libraries
  	'drupal/drupal.js',
  	'drupal/db.js',
  	'drupal/db.insert.js',
  	'drupal/entity.js',
  	'drupal/entity.datastore.js',
  	
  	// Codestrong specific Drupal entities
  	'cs/entity.js'
);

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

Ti.include(
	// All Codestrong windows
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
  	'windows/HtmlWindow.js',
  
  	// Create icons based on previous custom windows and
  	// load them into the main dashboard window
  	'cs/icons.js',
  	'windows/main.js'
);

// open (sponsor) URLs in the native browser, not a webview
Ti.App.addEventListener('openURL', function(e){
  	Ti.Platform.openURL(e.url);
});
