/**
 * login Model
 * Handles user login and creation. 
 * TODO: User creation should be moved to 
 * 'user' model. Should also change the model 
 * name to better fit login/out flow.
 */
 
(function(Model) {	
	var __errors = {
	    invalid: 'Please enter a valid username or password.',
	    incorrect: 'Username or password are incorrect.',
	    unknown: 'Unknown user. Please check your entry and tap "create".',
	    exists: 'User already exists. Please try again.'
	};
	
	function __onFocus( e, window ) {
	    window.animate({ top:"-130dp", duration:250 });
	}
	
	function __onBlur( e, window ) {
	    window.animate({ top:0, duration:250 });
	}
	
	function __validateField( e ) {}
	
	function __login( username, password, callback ) {
        var _Cloud = require( 'ti.cloud' );
        
	    if ( username && password ) {
	        
	        _Cloud.Users.login({
	            login: username,
	            password: password
	        }, function(e) {
	           
	            if ( e.error ) {
	                alert( __errors.unknown ); // there could be other errors that aren't currently handled...
	            } else {
	                Alloy.CFG.currentUser.loggedIn = true;
	                Alloy.CFG.currentUser.data     = e.users[ 0 ];
	                callback();
	            }
	            
	        });
	        
	    } else {
	        alert( __errors.invalid );
	    }
	    
	}
	
	function __logout( callback ) {
	    var _Cloud = require( 'ti.cloud' );
    	
	    _Cloud.Users.logout( callback );
	}
	
	function __create( username, password, callback ) {
	    var _Cloud = require( 'ti.cloud' );
    	
	    if ( username && password ) {
	        
	        __logout(function () {
	            
	            _Cloud.Users.create({
    	            username: username,
    	            password: password,
    	            password_confirmation: password,
    	        }, function(e) {

    	            if ( e.error ) {
    	                alert( __errors.exists ); // there could be other errors that aren't currently handled...
    	            } else {
    	                Alloy.CFG.currentUser.loggedIn = true;
    	                Alloy.CFG.currentUser.data     = e.users[ 0 ];
    	                callback();
    	            }

    	        });
    	        
	        });
	        
	    } else {
	        alert( __errors.invalid );
	    }
	    
	}
	
	return Model.extend({
	    onFocus:       __onFocus,
	    onBlur:        __onBlur,
	    validateField: __validateField,
	    login:         __login,
	    logout:        __logout,
	    create:        __create
	});
	
})