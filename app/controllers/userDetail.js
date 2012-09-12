/**
 * userDetail Controller
 * Builds userDetail panel.
 * TODO: This is repeated code
 * from 'profile' Controller.
 * IMPROVE! (last minute feature
 * - this is a mess...)
 */
 
var __parent = arguments[ 0 ].parent,
    __userId = arguments[ 0 ].userId;
    
$.close.addEventListener('click', function() {
    
    $.parent.animate({ left:320, opacity:1.0, duration:250 }, function() {
        __parent.remove( $.parent );
    });
    
});

__parent.add( $.parent );

var __roar = Alloy.getModel( 'roar' ),
    __user = Alloy.getModel( 'user' );

function __processRequest() {
    var _row  = null,
        _data = [];
    
    __roar.getAllFromUser(__userId, function(e) {

        for ( var r = 0, rl = e.roar.length; r < rl; r++ ) {
            _row  = Alloy.getController( 'roar', e.roar[ r ] ).getView( 'parent' );

            _data.push( _row );

            _row = null;
        }

        $.roars.setData( _data );

        _data.length = 0;

    });
}

__user.getById( __userId, function( user ) {
    $.photo.image = user.photo.urls.medium_500;
    $.firstname.text = user.first_name;
    $.lastname.text = user.last_name;
    $.role.text = user.role;
    $.username.text = '@' + user.username;
        
    __processRequest();
});

$.parent.animate({ left:0, opacity:1.0, duration:250 });