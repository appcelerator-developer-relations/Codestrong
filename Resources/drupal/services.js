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
var Ti, Drupal;

// Include the main Drupal library.
if (!Drupal) {
  Ti.include("drupal/drupal.js");
}

/**
 * Define a new library for Drupal Services integration.
 */
Drupal.services = {

  /**
   * List of known connections.
   *
   * Each connection is identified by a key that maps to a bare object (a la
   * associative arrays in PHP).  The connection information is three properties:
   * - endpointUrl: The URL of the Services endpoint on the remote server.
   * - user: The username of the Drupal user on that site to authenticate against.
   * - pass: The password of the Drupal user ont hat site to authenticate against.
   */
  connections: {},

  /**
   * Defines a new Drupal Services connection.
   *
   * Note that if a connection with this key name has already been defined the
   * new definition will be ignored.
   *
   * @param key
   *   The string name by which to identify this connection.
   * @param info
   *   The connection information to the server.  See the documentation for
   *   Drupal.connections for structure.
   */
  addConnectionInfo: function(key, info) {
    var defaults = {
      endpointUrl: '',
      user: '',
      pass: ''
    };

    if (this.connections[key] === undefined) {
      Drupal.setDefaults(info, defaults);
      this.connections[key] = info;
    }
  },

  /**
   * Creates a new DrupalService connection object.
   *
   * @param key
   *   The connection key for which we want a new connection. If not specified,
   *   'default' is used.
   * @returns {DrupalService}
   *   The newly created connection object. A new connection object is created
   *   each time this method is called.
   */
  createConnection: function(key) {
    if (key === undefined) {
      key = 'default';
    }

    // @todo Handle authentication.

    if (this.connections[key]) {
      var service = new Drupal.DrupalService(this.connections[key]);
      return service;
    }

    throw new Error('No Drupal Service connection key defined: ' + key);
  }
};


/**
 * Creates a Drupal connection object.
 *
 * Note that this object does not automatically open an XHR request to the server.
 * It is a manager for issuing multiple XHR requests using the same information
 * and credentials.
 *
 * @param settings
 *   The connection information for this server.
 * @returns {DrupalService}
 */
Drupal.DrupalService = function(settings) {
  var defaults = {
    endpointUrl: '',
    user: '',
    pass: ''
  };

  this.settings = Drupal.setDefaults(settings, defaults);
  this.loadHandler = this.defaultLoadHandler;
  this.errorHandler = this.defaultErrorHandler;

  return this;
};

/**
 * Default error handler for a Service request.
 *
 * This will often be overridden by a particular implementation.
 */
Drupal.DrupalService.prototype.defaultErrorHandler = function(e) {
  Ti.API.info("ERROR " + e.error);
  //alert(e.error);
};

/**
 * Default load handler for a Service request.
 *
 * This will almost always be overridden by a particular use case, either for
 * the connection object itself or for a particular request.  It is provided
 * simply to ensure that there is always a load handler defined somewhere.
 */
Drupal.DrupalService.prototype.defaultLoadHandler = function(e) {
  // This is a do nothing function. It's mostly here just so that there is always
  // a function defined somewhere.
  Ti.API.info("Data was loaded");
  //Ti.API.info(this.responseText);
};

/**
 * Issues a request against this Drupal server.
 *
 * @param options
 *   The details of the request to issue.  Possible keys include:
 *   - errorHandler: A callback function for responding to errors on the request.
 *   - loadHandler: A callback function for handling a successful response.
 *   - method: The HTTP method to use. Defaults to GET.
 *   - format: The format in which we want data returned from the Drupal server.
 *             Defaults to 'json'.
 */
Drupal.DrupalService.prototype.request = function(options) {

  var defaults = {
    errorHandler: this.errorHandler,
    loadHandler: this.loadHandler,
    method: 'GET',
    format: 'json'
  };

  Drupal.setDefaults(options, defaults);

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = options.errorHandler;
  xhr.onload = options.loadHandler;

  //open the client and encode our URL
  var url = this.settings.endpointUrl + '/' + options.query + '.' + options.format;
  xhr.open(options.method,url);

  // base64 encode our Authorization header
  //xhr.setRequestHeader('Authorization','Basic '+Ti.Utils.base64encode(username.value+':'+password.value));

  //send the data
  Ti.API.info("Sending request.");

  xhr.send();
};
