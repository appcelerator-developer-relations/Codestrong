var __model   = Alloy.getModel( 'roar' ),
    __user    = Alloy.getModel( 'user' ),
    __photo   = Alloy.getModel( 'photo' ),
    __roar    = arguments[ 0 ],
    __style   = null,
    __message = null,
    __image   = null,
    __code    = null;
    
switch ( __roar.type ) {
    case __model.types.message:
        __style      = __model.style.message;
        __style.text = __roar.message;
        __message    = Ti.UI.createLabel( __style );
        
        $.roar.add( __message );        
    break;
    
    case __model.types.photo:
        __style = __model.style.photo;
        __image = Ti.UI.createImageView( __style );
        
        __photo.getById( __roar.photoId, function( photo ) {
            __image.image = photo.urls.original;
        });
        
        $.roar.add( __image );
    break;
    
    case __model.types.code:
        __style      = __model.style.code;
        __style.text = __roar.message;
        __code       = Ti.UI.createLabel( __style );
        
        $.roar.add( __code );
    break;
    
    default: break;
}

$.photo.image       = __roar.user.photo.urls.thumb_100;
$.fullname.text     = __roar.user.first_name + ' ' + __roar.user.last_name;
$.username.text     = '@' + __roar.user.username;
$.commentCount.text = __roar.commentCount;
$.favCount.text     = __roar.favCount;
$.postDate.text     = __roar.created_at;

$.roar.addEventListener('click', function() {
    $.roarAlert.message = 'Individual roar detail is disabled.\n\nPosted: ' + __roar.created_at;
    
    $.roarAlert.show();
});

$.photo.addEventListener('click', function() {
    $.photoAlert.show();
});

$.commentContainer.addEventListener('click', function() {
    $.commentAlert.show();
});

$.favContainer.addEventListener('click', function() {
    $.favAlert.show();
});