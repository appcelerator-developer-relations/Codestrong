/**
 * directory Controller
 * Builds directory section.
 */

/*
var __user  = Alloy.getModel( 'user' );

__user.getAll(function(users) {
    var _controller = null;
    
    for ( var u = 0, ul = users.length; u < ul; u++) {
        _controller = Alloy.getController( 'directoryUser' );
        
        _controller.photo.parent.id = users[ u ].id;
        _controller.photo.image     = users[ u ].photo.urls.medium_500;
        _controller.fullname.text   = users[ u ].first_name + ' ' + users[ u ].last_name;
        _controller.role.text       = users[ u ].role;
        _controller.username.text   = '@' + users[ u ].username;
        
        $.content.add( _controller.parent );
        
        _controller.parent.addEventListener('click', function(e) {
            Alloy.getController('userDetail', { parent:$.parent, userId:e.source.id });
        });
        
        _view = null;
    }
    
});

*/