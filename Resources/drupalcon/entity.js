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
// Define our entity storage rules.
Drupal.entity.sites.main.types.node.schema = {
    fields: function () {
        return {
            fields: {
                changed: {
                    type: 'INTEGER'
                },
                room: {
                    type: 'VARCHAR'
                },
                start_date: {
                    type: 'VARCHAR'
                },
                end_date: {
                    type: 'VARCHAR'
                },
                instructors: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                'node_changed': ['changed'],
                'room_idx': ['room']
            }
        };
    },

    getFieldValues: function (entity, values) {
        values.changed = entity.changed;

        // The room may be multi-value because some sessions, like keynotes, are in
        // multiple rooms.  So we fold the denormalized value down to a string, and
        // convert the data blob version to an array so that we don't have to deal
        // with type checking it later.
        if (typeof entity.room !== undefined) {
            var rooms = [];
            if (typeof entity.room === 'string') {
                rooms.push(entity.room);
            } else if (typeof entity.room === 'object') {
                for (var key in entity.room) {
                    // We don't actually use hasOwnProperty() here because this is a
                    // JSON-derived object, so it doesn't exist. I don't get it either.
                    rooms.push(entity.room[key]);
                }
            }
            values.room = rooms.join(', ');
            entity.room = rooms;
        }

        if (entity.start_date) {
            var start_date = parseISO8601(entity.start_date + ':00');
            values.start_date = Drupal.getISODate(start_date);
        }

        if (entity.end_date) {
            var end_date = parseISO8601(entity.end_date + ':00');
            values.end_date = Drupal.getISODate(end_date);
        }

        // This is not really the right place for this sort of normalization, but
        // it's here so we'll use it.
        // On sessions, force the instructor and room fields to be collections.
        // That they may not be if single-value is a bug in the views_datasource
        // module.
        if (typeof entity.instructors !== undefined) {
            var instructors = [];
            if (typeof entity.instructors === 'string') {
                instructors.push(entity.instructors);
            } else if (typeof entity.instructors == 'object') {
                for (var insKey in entity.instructors) {
                    // We don't actually use hasOwnProperty() here because this is a
                    // JSON-derived object, so it doesn't exist. I don't get it either.
                    instructors.push(entity.instructors[insKey]);
                }
            }
            entity.instructors = instructors;
            values.instructors = instructors.join(', ');
        }
    },

    /**
     * Retrieves updates for this entity type.
     *
     * @param {string} bundle
     *   The bundle type we want to retrieve.
     * @param {Drupal.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param func
     *   A callback function to call after the fetching process has been completed.
     */
    defaultFetcher: function (bundle, store, func) {
        var url = 'http://codestrong.com/mobile/sessions/' + bundle;
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, url]);
    }
};
Drupal.entity.sites.main.types.node.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);

Drupal.entity.sites.main.types.user.schema = {
    fields: function () {
        return {
            fields: {
                full_name: {
                    type: 'VARCHAR'
                }
            },
            indexes: {
                full_name_idx: ['full_name'],
                name_idx: ['name']
            }
        };
    },

    /**
     * Retrieves updates for this entity type.
     *
     * @param {string} bundle
     *   The bundle type we want to retrieve.
     * @param {Drupal.entity.Datastore} store
     *   The datastore to which to save the retrieved entities.
     * @param {function} func
     *   A callback functino that will be called when the fetch is complete.
     */
    defaultFetcher: function (bundle, store, func) {
        this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://codestrong.com/mobile/speakers']);
    }

};
Drupal.entity.sites.main.types.user.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);