/**
 * user Model
 * Manages user retrieval.
 * TODO: Should handle user creation,
 * currently managed by 'login' Model.
 * TODO: Pagination!
 */
 
(function(Model) {

    function __getById( id, callback ) {
        var _Cloud = require( 'ti.cloud' );
                
        _Cloud.Users.query({
            where: {
                // This should be better.
                // New user won't have this...
                temp: id
            }
        }, function(e) {
            callback( e.users[ 0 ] );
        });
        
    }
    
    function __getAll( callback ) {
        var _Cloud = require( 'ti.cloud' );
        
        _Cloud.Users.query({
            page: 1,
            per_page: 10,
        }, function(e) {
            callback( e.users );
        });
        
    }

	return Model.extend({
	    getById: __getById,
	    getAll:  __getAll
	});
	
})