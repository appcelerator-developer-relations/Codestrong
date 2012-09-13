/**
 * app Controller
 * Builds and attaches header and nav.
 * Additionally passes section and app
 * views to be used for section mgmt
 * by application nav.
 */
 
var __header = Alloy.getController( 'header' ),
    __nav    = Alloy.getController( 'nav', { sectionParent:$.section, appWin:$.parent });

Alloy.CFG.currentWin = $.parent;

$.parent.addEventListener('open', function() {
    __header.parent.animate({ top:"0dp", duration:250 });
    __nav.parent.animate({ bottom:"0dp", duration:250 });
});

$.parent.add( __header.parent );
$.parent.add( __nav.parent );


$.openWindow = function() {
	$.parent.open();
};