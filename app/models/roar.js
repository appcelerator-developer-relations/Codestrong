/**
 * roar Model
 * Manages ROAR retrieval and posting.
 * TODO: Pagination!
 */
 
(function(Model) {    
    var __types = {
        message: 'message',
        photo: 'photo',
        code: 'code'
    };
    
    var __style = {
        message: {
            touchEnabled: false,
            top: '10dp',
            left: '10dp',
            right: '10dp',
            height: 'auto',
            textAlign: 'left',
            font: {
                fontFamily: 'Helvetica Neue'
            },
            color: '#333'
        },
        photo: {
            touchEnabled: false,
            top: '0dp',
            left: '0dp',
            bottom: '0dp',
            right: '0dp'
        },
        code: {
            touchEnabled: false,
            top: '10dp',
            left: '10dp',
            right: '10dp',
            height: 'auto',
            textAlign: 'left',
            font: {
                fontFamily: 'Courier'
            },
            color: '#333'
        }
    };
    
	function __getAll( page, callback ) {
	    var _Cloud = require('ti.cloud');
	    
	    _Cloud.Objects.query({
            classname: 'roar',
            page: page,
            per_page: 10,
            order: '-created_at',
        }, function(e) {
            callback( e );
        });
        
	}
	
	function __getAllFromUser( id, callback ) {
	    var _Cloud = require('ti.cloud');
        
	    _Cloud.Objects.query({
            classname: 'roar',
            page: 1,
            per_page: 10,
            order: '-created_at',
            where: {
                userId: id
            }
        }, function(e) {
            callback( e );
        });
        
	}
	
	function __post( userId, type, private, location, data, callback ) {
	    var _Cloud = require('ti.cloud');
        
	    _Cloud.Objects.create({
	        classname: 'roar',
	        fields: {
	            type: type,
	            message: data,
	            commentCount: 0,
	            favCount: 0,
	            photoId: '',
	            userId: userId
	        }
	    }, function(e) {
	        callback( e );
	    });
	    
	}

	return Model.extend({
	    types:          __types,
	    style:          __style,
	    getAll:         __getAll,
	    getAllFromUser: __getAllFromUser,
	    post:           __post
	});
	
})