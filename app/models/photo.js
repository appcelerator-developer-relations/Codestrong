/**
 * photo Model
 * Manages photo retrieval and upload.
 */
 
(function(Model) {

    function __uploadPhoto( photoData, update ) {}
    
    function __getById( id, callback ) {
        var _Cloud = require( 'ti.cloud' );
        
        _Cloud.Photos.query({
            where: {
                id: id
            }
        }, function( e ) {
            callback( e.photos[ 0 ] );
        });
    }

	return Model.extend({
	    uploadPhoto: __uploadPhoto,
	    getById:     __getById
	});
	
})