/**
 * profile Controller
 * Builds profile section. 
 * TODO: UI and functionality for 
 * content types.
 * TODO: Move request processing
 * to 'roar' Model.
 */
 
var __roar = Alloy.getModel( 'roar' )

/*
if ( Alloy.CFG.currentUser.data.photo ) {
    $.photo.image = Alloy.CFG.currentUser.data.photo.urls.medium_500;
} 

$.firstname.text = Alloy.CFG.currentUser.data.first_name;
$.lastname.text  = Alloy.CFG.currentUser.data.last_name;
$.role.text      = Alloy.CFG.currentUser.data.role;
$.username.text  = '@' + Alloy.CFG.currentUser.data.username;
*/

// Request processing should be moved to 'roar' Model.
function __processRequest() {
	/*
    var _row  = null,
        _data = [];
        
    __roar.getAllFromUser(Alloy.CFG.currentUser.data.id, function(e) {

        for ( var r = 0, rl = e.roar.length; r < rl; r++ ) {
            _row  = Alloy.getController( 'roar', e.roar[ r ] ).getView( 'parent' );

            _data.push( _row );

            _row = null;
        }

        $.roars.setData( _data );

        _data.length = 0;

    });
    */
}

__processRequest();

// Set global method for refreshing home roars list.
// This is way too heavy ATM, since we're just getting
// everything and re-setting the table data.
Alloy.CFG.refreshProfileRoars = __processRequest;
