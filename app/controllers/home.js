/**
 * home Controller
 * Builds home section.
 * TODO: Move request processing
 * to 'roar' Model.
 */
 
var __roar = Alloy.getModel( 'roar' );

var __currentPage = 1; // Since pagination isn't implemented, this does nothing.

// Request processing should be moved to 'roar' Model.
function __processRequest() {
    var _roar = null,
        _row  = null,
        _data = [];
    
    __roar.getAll(1, function(e) {
        
        for ( var r = 0, rl = e.roar.length; r < rl; r++ ) {
            _row  = Alloy.getController( 'roar', e.roar[ r ] ).getView( 'parent' );
            
            _data.push( _row );
                        
            _row = null;
        }
        
        $.parent.setData( _data );
        
        _data.length = 0;
        
        // __currentPage ++; // Only for pagination.
    });
    
}

// This would be used for infinite scrolling.
__processRequest();

// Set global method for refreshing home roars list.
// This is way too heavy ATM, since we're just getting
// everything and re-setting the table data.
Alloy.CFG.refreshRoars = __processRequest;