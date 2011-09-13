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

/**
 * Define a new library for Drupal Entity storage.
 */
Drupal.db = {

    /**
     * Flag to indicate a query call should simply return NULL.
     *
     * This is used for queries that have no reasonable return value anyway, such
     * as INSERT statements to a table without a serial primary key.
     */
    RETURN_NULL: 0,

    /**
     * Flag to indicate a query call should return the prepared statement.
     */
    RETURN_STATEMENT: 1,

    /**
     * Flag to indicate a query call should return the number of affected rows.
     */
    RETURN_AFFECTED: 2,

    /**
     * Flag to indicate a query call should return the "last insert id".
     */
    RETURN_INSERT_ID: 3,

    /**
     * An nested array of all active connections. It is keyed by database name
     *
     * @var array
     */
    connections: [],

    /**
     * The key of the currently active database connection.
     *
     * @var string
     */
    activeKey: 'default',

    /**
     * A processed copy of the database connection information from settings.php.
     *
     * @var array
     */
    databaseInfo: [],

    errorMode: 0,

    ERROR_LEVEL_NONE: 0,
    ERROR_LEVEL_DEBUG: 1,


    /**
     * Gets the connection object for the specified database key.
     *
     * @param key
     *   The database connection key. Defaults to NULL which means the active key.
     *
     * @return {Drupal.db.Connection}
     *   The corresponding connection object.
     */
    getConnection: function (key) {
        if (!key) {
            key = this.activeKey;
        }

        if (!key) {
            // By default, we want the active connection, set in setActiveConnection.
            key = this.activeKey;
        }

        if (!this.connections[key]) {
            // If necessary, a new connection is opened.
            this.connections[key] = this.openConnection(key);
        }
        return this.connections[key];
    },

    /**
     * Determines if there is an active connection.
     *
     * Note that this method will return FALSE if no connection has been
     * established yet, even if one could be.
     *
     * @return
     *   TRUE if there is at least one database connection established, FALSE
     *   otherwise.
     */
    isActiveConnection: function () {
        return (this.connections.length > 0);
    },

    /**
     * Sets the active connection to the specified key.
     *
     * @return
     *   The previous database connection key. If the requested
     *   key was not registered, null is returned and no changes
     *   are made.
     */
    setActiveConnection: function (key) {
        if (!key) {
            key = 'default';
        }

        if (this.databaseInfo[key]) {
            var oldKey = this.activeKey;
            this.activeKey = key;
            return oldKey;
        }
    },

    /**
     * Adds database connection information for a given key.
     *
     * In practice, all this method does is register a database name that can 
     * be used. It is mostly to parallel the Drupal-side method of the same
     * name, which by necessity is much more complex. In our case we are dealing
     * only with single-use SQLite databases so this is just to register a name
     * as openable.
     *
     * @param key
     *   The database key.
     */
    addConnectionInfo: function (key) {
        this.databaseInfo[key] = key;
    },

    /**
     * Opens a connection to the server specified by the given key.
     *
     * @param $key
     *   The database connection key, as specified in settings.php. The default is
     *   "default".
     */
    openConnection: function (key) {
        if (!key) {
            key = 'default';
        }

        // If the requested database does not exist then it is an unrecoverable
        // error.
        if (!this.databaseInfo[key]) {
            // @todo Turn this into a proper exception object, or whatever is appropriate in Javascript.
            //Ti.API.error('ERROR: The specified database connection is not defined: ' + key);
            //throw new Error('The specified database connection is not defined: ' + key);
        }

        var newConnection = new Drupal.db.Connection(key);

        return newConnection;
    },

    /**
     * Closes a connection to the server specified by the given key and target.
     *
     * @param $target
     *   The database target name.  Defaults to NULL meaning that all target
     *   connections will be closed.
     * @param $key
     *   The database connection key. Defaults to NULL which means the active key.
     */
    closeConnection: function (key) {
        // Gets the active connection by default.
        if (!key) {
            key = this.activeKey;
        }

        this.connections[key].close();
        this.connections[key] = undefined;
    }
};

/**
 * Base Database API class.
 *
 * This class provides a Drupal-specific connection object.
 */
Drupal.db.Connection = function (key) {
    this.key = key;
    this.connection = Ti.Database.open(key);
};

Drupal.db.Connection.prototype.query = function (stmt, args) {
    if (!args) {
        args = [];
    }

    if (Drupal.db.errorMode >= Drupal.db.ERROR_LEVEL_DEBUG) {
        Ti.API.debug('Executing query: ' + stmt + "\nArguments: " + args.join(', '));
    }

    var result = this.connection.execute(stmt, args);
    this.affectedRows = this.connection.affectedRows;

    return result;
};

Drupal.db.Connection.prototype.close = function () {
    this.connection.close();
};

Drupal.db.Connection.prototype.remove = function () {
    this.connection.remove();
};

Drupal.db.Connection.prototype.insert = function (table) {
    return new Drupal.db.InsertQuery(table, this);
};

Drupal.db.Connection.prototype.dropTable = function (table) {
    if (this.tableExists(table)) {
        this.query("DROP TABLE IF EXISTS " + table);
        return true;
    }

    return false;
};

Drupal.db.Connection.prototype.createTable = function (name, table) {
    var queries = [];
    queries = queries.concat('CREATE TABLE ' + name + '(' + this.createColumnSql(name, table) + ')').concat(this.createIndexSql(name, table));

    for (var i = 0; i < queries.length; i++) {
        this.query(queries[i]);
    }
};

Drupal.db.Connection.prototype.createColumnSql = function (tablename, schema) {
    var sqlArray = [];

    // Add the SQL statement for each field.
    var field;
    for (var name in schema.fields) {
        if (schema.fields.hasOwnProperty(name)) {
            field = schema.fields[name];
            sqlArray.push(this.createFieldSql(name, field));
        }
    }

    // Process keys.
    if (schema.primarKey) {
        sqlArray.push(" PRIMARY KEY (" + this.createKeySql(schema.primaryKey) + ")");
    }

    return sqlArray.join(", \n");
};

Drupal.db.Connection.prototype.createFieldSql = function (name, spec) {
    var sql;

    spec.type = spec.type.toUpperCase();

    if (spec.hasOwnProperty('autoIncrement')) {
        sql = name + " INTEGER PRIMARY KEY AUTOINCREMENT";
        if (spec.unsigned) {
            sql += ' CHECK (' + name + '>= 0)';
        }
    } else {
        sql = name + ' ' + spec.type;

        if (['VARCHAR', 'TEXT'].indexOf(spec.type) !== false && spec.length) {
            sql += '(' + spec.length + ')';
        }

        if (spec.hasOwnProperty('notNull')) {
            if (spec['not null']) {
                sql += ' NOT NULL';
            } else {
                sql += ' NULL';
            }
        }

        if (spec.hasOwnProperty('unsigned')) {
            sql += ' CHECK (' + name + '>= 0)';
        }

        if (spec.hasOwnProperty('defaultValue')) {
            if (typeof spec.defaultValue == 'String') {
                spec.defaultValue = "'" + spec.defaultValue + "'";
            }
            sql += ' DEFAULT ' + spec.defaultValue;
        }

        if (!spec.hasOwnProperty('notNull') && !spec.hasOwnProperty('defaultValue')) {
            sql += ' DEFAULT NULL';
        }
    }
    return sql;
};


Drupal.db.Connection.prototype.createIndexSql = function (table, schema) {
    var sql = [];
    var key;

    if (schema.hasOwnProperty('uniqueKeys')) {
        for (key in schema.uniqueKeys) {
            if (schema.uniqueKeys.hasOwnProperty(key)) {
                sql.push('CREATE UNIQUE INDEX ' + table + '_' + key + ' ON ' + table + ' (' + this.createKeySql(schema.uniqueKeys[key]) + "); \n");
            }
        }
    }
    if (schema.hasOwnProperty('indexes')) {
        for (key in schema.indexes) {
            if (schema.indexes.hasOwnProperty(key)) {
                sql.push('CREATE INDEX ' + table + '_' + key + ' ON ' + table + ' (' + this.createKeySql(schema.indexes[key]) + "); \n");
            }
        }
    }
    return sql;
};

Drupal.db.Connection.prototype.createKeySql = function (fields) {
    var ret = [];
    for (var i = 0; i < fields.length; i++) {
        if (typeof fields[i] == 'Array') {
            ret.push(fields[i][0]);
        } else {
            ret.push(fields[i]);
        }
    }
    return ret.join(', ');
};

Drupal.db.Connection.prototype.tableExists = function (table) {
    var result = this.query('SELECT 1 FROM sqlite_master WHERE type = ? AND name = ?', ['table', table]);
    var ret = Boolean(result.rowCount);
    result.close();
    return ret;
};

Drupal.db.Query = function (connection) {
    this.connection = connection;
    this.comments = [];
    this.nextPlaceholder = 0;
};

/**
 * Gets the next placeholder value for this query object.
 *
 * @return int
 *   Next placeholder value.
 */
Drupal.db.Query.prototype.nextPlaceholder = function () {
    return this.nextPlaceholder++;
};

/**
 * Adds a comment to the query.
 *
 * By adding a comment to a query, you can more easily find it in your
 * query log or the list of active queries on an SQL server. This allows
 * for easier debugging and allows you to more easily find where a query
 * with a performance problem is being generated.
 *
 * @param comment
 *   The comment string to be inserted into the query.
 *
 * @return Drupal.db.Query
 *   The called object.
 */
Drupal.db.Query.prototype.comment = function (comment) {
    this.comments.push(comment);
    return this;
};

/**
 * Returns a reference to the comments array for the query.
 *
 * Because this method returns by reference, alter hooks may edit the comments
 * array directly to make their changes. If just adding comments, however, the
 * use of comment() is preferred.
 *
 * @return Array
 *   A reference to the comments array structure.
 */
Drupal.db.Query.prototype.getComments = function () {
    return this.comments;
};