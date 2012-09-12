/**
 * boxloader Model
 * ROAR loader UI.
 */
 
(function(Model) {
    var __boxloader = null,
        __parent    = null;
    
    function __show( boxloader, parent ) {
        __boxloader = boxloader;
        __parent    = parent;
        
        __parent.add( __boxloader.parent );
        
        __parent.animate({ opacity:1.0, duration:250 });
    }
    
    function __destroy() {
        __parent.animate({ opacity:0.0, duration:250 }, function() {
            __parent.remove( __boxloader.parent );

            __boxloader = null;
            __parent    = null;
        });
    }
    
	return Model.extend({
	    show: __show,
	    destroy: __destroy
	});
	
})