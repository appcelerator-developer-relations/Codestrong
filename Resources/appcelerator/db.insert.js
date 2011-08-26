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
var Drupal, Ti;

Drupal.db.InsertQuery = function(table, connection) {
  /**
   * The table on which to insert.
   *
   * @var string
   */
  this.table = table;

  Drupal.db.Query.apply(this, [connection]);

  /**
   * An array of fields on which to insert.
   *
   * @var array
   */
  this.insertFields = [];

  /**
   * An array of fields that should be set to their database-defined defaults.
   *
   * @var array
   */
  this.defaultFields = [];

  /**
   * A nested array of values to insert.
   *
   * insertValues is an array of arrays. Each sub-array is either an
   * associative array whose keys are field names and whose values are field
   * values to insert, or a non-associative array of values in the same order
   * as insertFields.
   *
   * Whether multiple insert sets will be run in a single query or multiple
   * queries is left to individual drivers to implement in whatever manner is
   * most appropriate. The order of values in each sub-array must match the
   * order of fields in insertFields.
   *
   * @var array
   */
  this.insertValues = [];

  /**
   * A SelectQuery object to fetch the rows that should be inserted.
   *
   * @var SelectQueryInterface
   */
  this.fromQuery = null;
};

// This defines the "parent" class, kinda.  It has to happen after the
// constructor definition because otherwise Drupal.db.InsertQuery doesn't
// exist yet.
Drupal.db.InsertQuery.prototype = Drupal.constructPrototype(Drupal.db.Query);


/**
 * Adds a set of field->value pairs to be inserted.
 *
 * This method may only be called once. Calling it a second time will be
 * ignored. To queue up multiple sets of values to be inserted at once,
 * use the values() method.
 *
 * @param fields
 *   An array of fields on which to insert. This array may be indexed or
 *   associative. If indexed, the array is taken to be the list of fields.
 *   If associative, the keys of the array are taken to be the fields and
 *   the values are taken to be corresponding values to insert. If a
 *   values argument is provided, fields must be indexed.
 * @param values
 *   An array of fields to insert into the database. The values must be
 *   specified in the same order as the fields array.
 *
 * @return Drupal.db.InsertQuery
 *   The called object.
 */
Drupal.db.InsertQuery.prototype.fields = function(fields, values) {
  if (this.insertFields.length === 0) {
    if (!values) {
      // If fields is an array, then we're specifying only the fields, not values.
      // If it's not an array then it must be an object, in which case we're 
      // specifying both the fields and values at once.
      if (!Array.isArray(fields)) {
        var keys = [];
        var arrValues = [];
        for (var prop in fields) {
          if (fields.hasOwnProperty(prop)) {
            keys.push(prop);
            arrValues.push(fields[prop]);
          }
        }
        if(arrValues.length) {
          values = arrValues;
        }
        
        fields = keys;
      }
    }
    
    this.insertFields = fields;
    if (values) {
      this.insertValues.push(values);
    }
  }

  return this;
};

/**
 * Adds another set of values to the query to be inserted.
 *
 * If values is a numeric-keyed array, it will be assumed to be in the same
 * order as the original fields() call. If it is associative, it may be
 * in any order as long as the keys of the array match the names of the
 * fields.
 *
 * @param values
 *   An array of values to add to the query.
 *
 * @return Drupal.db.InsertQuery
 *   The called object.
 */
Drupal.db.InsertQuery.prototype.values = function(values) {
  if (Array.isArray(values)) {
    this.insertValues.push(values);
  }
  else {
    // Reorder the submitted values to match the fields array.
    // For consistency, the values array is always numerically indexed.
    var insertValues = [];
    for (var key in this.insertFields) {
      if (this.insertFields.hasOwnProperty(key)) {
        insertValues.push(values[this.insertFields[key]]);
      }
    }
    this.insertValues.push(insertValues);
  }
  return this;
};

/**
 * Specifies fields for which the database defaults should be used.
 *
 * If you want to force a given field to use the database-defined default,
 * not NULL or undefined, use this method to instruct the database to use
 * default values explicitly. In most cases this will not be necessary
 * unless you are inserting a row that is all default values, as you cannot
 * specify no values in an INSERT query.
 *
 * Specifying a field both in fields() and in useDefaults() is an error
 * and will not execute.
 *
 * @param fields
 *   An array of values for which to use the default values
 *   specified in the table definition.
 *
 * @return Drupal.db.InsertQuery
 *   The called object.
 */
Drupal.db.InsertQuery.prototype.useDefaults = function(fields) {
  this.defaultFields = fields;
  return this;
};

/**
 * Preprocesses and validates the query.
 *
 * @return Boolean
 *   TRUE if the validation was successful, FALSE if not.
 *
 * @throws FieldsOverlapException
 * @throws NoFieldsException
 */
Drupal.db.InsertQuery.prototype.preExecute = function() {
  // @todo Port this to Javascript, however you'd do that.
  // Confirm that the user did not try to specify an identical
  // field and default field.
  //if (array_intersect($this->insertFields, $this->defaultFields)) {
  //  throw new FieldsOverlapException('You may not specify the same field to have a value and a schema-default value.');
  //}

  // @todo Port this to Javascript, however you'd do that.
  //if (!empty($this->fromQuery)) {
    // We have to assume that the used aliases match the insert fields.
    // Regular fields are added to the query before expressions, maintain the
    // same order for the insert fields.
    // This behavior can be overridden by calling fields() manually as only the
    // first call to fields() does have an effect.
  //  $this->fields(array_merge(array_keys($this->fromQuery->getFields()), array_keys($this->fromQuery->getExpressions())));
  //}

  // Don't execute query without fields.
  if ((this.insertFields.length + this.defaultFields.length) === 0) {
    Ti.API.error('ERROR: There are no fields available to insert with.');
    throw new Error('There are no fields available to insert with.');
  }

  // If no values have been added, silently ignore this query. This can happen
  // if values are added conditionally, so we don't want to throw an
  // exception.
  if (!this.insertValues[0] && this.insertFields.length > 0 && !this.fromQuery) {
    return false;
  }
  return true;
};

/**
 * Executes the insert query.
 *
 * @return integer
 *   The last insert ID of the query, if one exists. If the query
 *   was given multiple sets of values to insert, the return value is
 *   undefined. If no fields are specified, this method will do nothing and
 *   return NULL. That makes it safe to use in multi-insert loops.
 */
Drupal.db.InsertQuery.prototype.execute = function() {
  // If validation fails, simply return NULL. Note that validation routines
  // in preExecute() may throw exceptions instead.
  //Ti.API.debug('In InsertQuery.execute()');
  if (!this.preExecute()) {
    return null;
  }

  //Ti.API.debug('InsertQuery.preExecute() passed all tests.');

  if (!this.insertFields) {
    return this.connection.query('INSERT INTO ' + this.table + ' DEFAULT VALUES');
  }
  
  // @todo Port this to Javascript, however we'd do that.
  // If we're selecting from a SelectQuery, finish building the query and
  // pass it back, as any remaining options are irrelevant.
  //if (!empty($this->fromQuery)) {
  //  $sql = (string) $this;
  //  // The SelectQuery may contain arguments, load and pass them through.
  //  return $this->connection->query($sql, $this->fromQuery->getArguments(), $this->queryOptions);
  //}

  // @todo Handle transactions, somehow.
  // Each insert happens in its own query in the degenerate case. However,
  // we wrap it in a transaction so that it is atomic where possible. On many
  // databases, such as SQLite, this is also a notable performance boost.
  //$transaction = $this->connection->startTransaction();

  try {
    var sql = this.sqlString();
    for (var i = 0; i < this.insertValues.length; i++) {
      //Ti.API.debug('About to call query()....');
      this.connection.query(sql, this.insertValues[i]);
    }
  }
  catch (e) {
    // One of the INSERTs failed, rollback the whole batch.
    //$transaction->rollback();
    // Rethrow the exception for the calling code.
    Ti.API.error(e.toString());
    throw e;
  }

  // Re-initialize the values array so that we can re-use this query.
  this.insertValues = [];

  // Transaction commits here where $transaction looses scope.
};

/**
 * Convert this query to a SQL string.
 */
Drupal.db.InsertQuery.prototype.sqlString = function() {
  // Create a comments string to prepend to the query.
  var comments = (this.comments.length) ? '/* ' + this.comments.join('; ') + ' */ ' : '';

  // Produce as many generic placeholders as necessary.
  var placeholders = [];
  var length = this.insertFields.length;
  for (var i = 0; i < length; i++) {
    placeholders.push('?');
  }
  
  // @todo Restore this once we figure out how to do INSERT FROM queries.
  // If we're selecting from a SelectQuery, finish building the query and
  // pass it back, as any remaining options are irrelevant.
  //if (this.fromQuery) {
    //return comments + 'INSERT INTO {' + $this->table + '} (' + implode(', ', $this->insertFields) + ') ' + (string)$this->fromQuery;
  //}

  return comments + 'INSERT INTO ' + this.table + ' (' + this.insertFields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';
};


Drupal.getObjectProperties = function(o) {
  var properties = [];
  var values = [];
  for (var prop in o) {
    if (o.hasOwnProperty(prop)) {
      properties.push(prop);
      values.push(o[prop]);
    }
  }
  
  return properties;
};

