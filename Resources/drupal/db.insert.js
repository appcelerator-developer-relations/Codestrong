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
 *
 * The CODESTRONG mobile companion app was based off the original work done by the team
 * at palatir.net which included:
 *
 * Larry Garfield
 * Pat Teglia
 * Jen Simmons
 *
 * This code can be located at: https://github.com/palantirnet/drupalcon_mobile
 *
 * The following Appcelerator Employees also spent time answering questions via phone calls, IRC
 * and email and contributed code to the original Drupalcon Mobile application.
 * 
 * Tony Guntharp
 * Chad Auld
 * Don Thorp
 * Marshall Culpepper
 * Stephen Tramer
 * Rick Blalock
 */
// Declaring variables to prevent implied global error in jslint
var Drupal, Ti;

Drupal.db.InsertQuery = function (table, connection) {
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
Drupal.db.InsertQuery.prototype.fields = function (fields, values) {
    if (this.insertFields.length === 0) {
        if (!values) {
            // If fields is an array, then we're specifying only the fields, not values.
            // If it's not an array then it must be an object, in which case we're 
            // specifying both the fields and values at once.
            if (!Array.isArray(fields)) {
                var keys = [];
                var arrValues = [];
                for (var prop in fields) {
                    if (Codestrong.isAndroid() || fields.hasOwnProperty(prop)) {
                        keys.push(prop);
                        arrValues.push(fields[prop]);
                    }
                }
                if (arrValues.length) {
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
Drupal.db.InsertQuery.prototype.values = function (values) {
    if (Array.isArray(values)) {
        this.insertValues.push(values);
    } else {
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
Drupal.db.InsertQuery.prototype.useDefaults = function (fields) {
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
Drupal.db.InsertQuery.prototype.preExecute = function () {
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
Drupal.db.InsertQuery.prototype.execute = function () {
    // If validation fails, simply return NULL. Note that validation routines
    // in preExecute() may throw exceptions instead.
    if (!this.preExecute()) {
        return null;
    }

    if (!this.insertFields) {
        return this.connection.query('INSERT INTO ' + this.table + ' DEFAULT VALUES');
    }

    try {
        var sql = this.sqlString();
        for (var i = 0; i < this.insertValues.length; i++) {
            this.connection.query(sql, this.insertValues[i]);
        }
    } catch (e) {
        Ti.API.error(e.toString());
        throw e;
    }

    // Re-initialize the values array so that we can re-use this query.
    this.insertValues = [];
};

/**
 * Convert this query to a SQL string.
 */
Drupal.db.InsertQuery.prototype.sqlString = function () {
    // Create a comments string to prepend to the query.
    var comments = (this.comments.length) ? '/* ' + this.comments.join('; ') + ' */ ' : '';

    // Produce as many generic placeholders as necessary.
    var placeholders = [];
    var length = this.insertFields.length;
    for (var i = 0; i < length; i++) {
        placeholders.push('?');
    }

    return comments + 'INSERT INTO ' + this.table + ' (' + this.insertFields.join(', ') + ') VALUES (' + placeholders.join(', ') + ')';
};


Drupal.getObjectProperties = function (o) {
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