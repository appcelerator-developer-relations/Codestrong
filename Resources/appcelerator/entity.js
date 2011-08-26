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

// Declaring variables to prevent implied global error in jslint
var Ti, Drupal;
var rootPath = '../../../../../../../../../../';

// Include the main Drupal library.
if (!Drupal) {
  Ti.include(rootPath+'appcelerator/drupal.js');
}

if (!Drupal.db) {
  Ti.include(rootPath+'appcelerator/db.js');
}

/**
 * Define a new library for Drupal Entity storage.
 */
Drupal.entity = {

  sites: {
    main: {
      /**
       * Entity types known to the system.
       *
       * This is a subset of the information provided in hook_entity_info(). We have
       * to specify it again here because we may not be dealing with Drupal 7 on
       * the other end.
       *
       * We're using lower_case variables here instead of camelCase so that they
       * exactly match the PHP variables.  That will make dynamic definition easier
       * later.
       *
       * @todo Make it possible to override this data with a direct pull of
       *       hook_entity_info() from a connected server.
       */
      types: {
        node: {
          label: Ti.Locale.getString('Node'),
          entity_keys: {
            id: 'nid',
            revision: 'vid',
            bundle: 'type',
            label: 'title'
          },
          schema: {},
          requestUrl: function(id) {
            return 'node/' + id;
          }
        },
        user: {
          label: Ti.Locale.getString('User'),
          entity_keys: {
            id: 'uid',
            bundle: null,
            label: 'name'
          },
          schema: {},
          requestUrl: function(id) {
            return 'user/' + id;
          }
        }
      }
    }
  },
  
  /**
   * Creates a new entity storage object.
   *
   * @param string site
   *   A key for the site from which we are mirroring 
   *   content. This corresponds to the database we are
   *   loading.
   * @param string entityType
   *   The type of entity (node, user, etc.) that we are
   *   accessing.
   * @return Drupal.entity.Datastore
   *   A new datastore object for the specified site and entity.
   */
  db: function(site, entityType) {
    var conn = Drupal.db.openConnection(site);
    return new Drupal.entity.Datastore(site, conn, entityType, this.entityInfo(site, entityType));
  },

  /**
   * Retrieves information about a defined entity.
   *
   * @param string site
   *   The site key for which we want information.
   * @param entityType
   *   The type of entity for which we want information.
   * @return Object
   *   The entity definition as an object/associative array,
   *   or null if not found.
   */
  entityInfo: function(site, entityType) {
    if (this.sites[site].types[entityType] !== undefined) {
      return this.sites[site].types[entityType];
    }
    Ti.API.error('Entity type ' + entityType + ' not defined for site ' + site);
  },

  /**
   * Mirror an entity from a remote server.
   *
   * Note that the mirroring process is asynchronous. That is, the entity
   * will not be available locally until sometime after this method returns,
   * depending on network latency.
   *
   * @todo Add an event that fires when mirroring is done.
   *
   * @param site
   *   The site key from which to mirror.
   * @param entityType
   *   The type of entity to be mirrored.
   * @param id
   *   The ID of the entity that is being mirrored.
   */
  mirror: function(site, entityType, id) {
    var service = Drupal.services.createConnection('main');
    service.loadHandler = function() {
      Drupal.entity.db(site, entityType).save(JSON.parse(this.responseText));
    };

    service.request({query: this.entityInfo(site, entityType).requestUrl(id)});
  }
};


Drupal.entity.DefaultSchema = function() {

  this.fetchUrl = null;

  this.bypassCache = false;

  this.fetchers = {};

};


Drupal.entity.DefaultSchema.prototype.fields = function() {
  return {};
};

Drupal.entity.DefaultSchema.prototype.getFieldValues = function(entity, values) {
  // Do nothing.
};

Drupal.entity.DefaultSchema.prototype.defaultFetcher = function(bundle, store, func, fetchUrl) {
  var xhr = Titanium.Network.createHTTPClient();
  //xhr.onerror = options.errorHandler;
  xhr.onload = function() {
    var entities = JSON.parse(this.responseText).entities;

    var length = entities.length;

    Ti.API.debug('Downloading ' + length + ' entities of type ' + store.entityType);

    for (var i=0; i < length; i++) {
      //Ti.API.debug('Downloading entity: ' + entities[i].entity);
      store.save(entities[i].entity);
    }

    // Call our post-completion callback.
    if (func) {
      func();
    }
  };

  //open the client and encode our URL
  var url = fetchUrl || this.fetchUrl || null;
  if (url) {
    if (this.bypassCache) {
      if (strpos(url, '?') === false) {
        url += '?cacheBypass=' + Math.random();
      }
      else {
        url += '&cacheBypass=' + Math.random();
      }
    }
    xhr.open('GET', url);

    //send the data
    Ti.API.debug('Requesting data from: ' + url);
    xhr.send();
  }
  else {
    Ti.API.error('No fetching URL found. Unable to retrieve data.');
  }
};

Ti.include(rootPath+'appcelerator/entity.datastore.js');


//These kinda sorta serve as a unit test, ish, maybe, for now.

/*
function resetTest() {
  Drupal.db.addConnectionInfo('main');
  
  var conn = Drupal.db.openConnection('main');

  //Reset for testing.
  conn.remove();

  conn.close();
}

resetTest();

var node1 = {
    nid: 1,
    type: 'page',
    title: 'Hello world'
  };

var node2 = {
    nid: 2,
    type: 'page',
    title: 'Goodbye world'
  };

var store = Drupal.entity.db('main', 'node');

// Reset everything.
store.initializeSchema();

var ret;

Ti.API.info('Inserting node.');
ret = store.insert(node1);
Ti.API.info('Insert new entity returned: ' + ret);

ret = store.save(node2);
Ti.API.info('Save on new entity returned: ' + ret);

var count = store.connection.query('SELECT COUNT(*) FROM node').field(0);
Ti.API.info('There should be 2 records.  There are actually: ' + count);

Ti.API.info('Checking for record.');
if (store.exists(1)) {
  Ti.API.info('Record exists.');
}
else {
  Ti.API.info('Record does not exist.');
}

var loaded_node = store.load(1);

Ti.API.info(loaded_node);

Ti.API.info('Trying to load multiple nodes.');
var nodes = store.loadMultiple([2, 1]);

Ti.API.info('Checking returned nodes.');
for (var i = 0; i < nodes.length; i++) {
  Ti.API.info(nodes[i]);
}

var node = store.load(1);
node.title = "Hello, Drupal world.";
ret = store.save(node);
Ti.API.info('Save on existing entity returned: ' + ret);

var nodeB = store.load(1);
Ti.API.info(nodeB);

Ti.API.info('Try to delete a node now.');
ret = store.remove(1);
Ti.API.info('Removing existing entity returned: ' + ret);

var count = store.connection.query('SELECT COUNT(*) FROM node').field(0);
Ti.API.info('There should be 1 record.  There are actually: ' + count);
*/

/*
var store = Drupal.entity.db('site');
var node = store.load('node', id);
var nodes = store.loadMultiple('node', ids);
store.save('node', node);
*/



