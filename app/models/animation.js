/**
 * animation Model
 * Helpers for custom ROAR animations.
 */
 
(function(Model) {
    
    function __zoom( view, callback ) {
        var _matrix = Ti.UI.create2DMatrix({ scale:1.5 });
        
        view.animate({ transform:_matrix, opacity:0.0, duration:250 }, function() {
            callback();
        });
        
    }

    return Model.extend({
        zoom: __zoom
    });
    
})