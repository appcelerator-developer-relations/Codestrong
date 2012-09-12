/**
 * nav Controller
 * Builds application navigation.
 */
 
var __nav           = Alloy.getModel( 'nav' ),
    __roar          = Alloy.getModel( 'roar' ),
    __selectionView = $.selection;
    
var __selectionPosition = {
    home: "0dp",
    directory: "61dp",
    notifications: "199dp",
    profile: "260dp"
};

var __sections = {
    home: Alloy.getController( 'home' ),
    directory: Alloy.getController( 'directory' ),
    notifications: Alloy.getController( 'notifications' ),
    profile: Alloy.getController( 'profile' )
};

var __sectionParent = arguments[ 0 ].sectionParent,
    __appWin        = arguments[ 0 ].appWin,
    __post          = null;

__nav.setSectionViews( [ __sections.home.parent, __sections.directory.parent, __sections.notifications.parent, __sections.profile.parent ] );

__sectionParent.add( __sections.home.parent );
__sectionParent.add( __sections.directory.parent );
__sectionParent.add( __sections.notifications.parent );
__sectionParent.add( __sections.profile.parent );

$.home.addEventListener('click', function() {
    __nav.changeSection( __nav.sections.home, __sections.home.parent, { view:__selectionView, position:__selectionPosition.home } );
});

$.directory.addEventListener('click', function() {
    __nav.changeSection( __nav.sections.directory, __sections.directory.parent, { view:__selectionView, position:__selectionPosition.directory } );
});

$.notifications.addEventListener('click', function() {
    __nav.changeSection( __nav.sections.notifications, __sections.notifications.parent, { view:__selectionView, position:__selectionPosition.notifications } );
});

$.profile.addEventListener('click', function() {
    __nav.changeSection( __nav.sections.profile, __sections.profile.parent, { view:__selectionView, position:__selectionPosition.profile } );
});

$.broadcast.addEventListener('click', function() {
    __post = Alloy.getController( 'post', __appWin );
});