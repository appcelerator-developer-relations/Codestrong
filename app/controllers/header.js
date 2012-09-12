/**
 * header Controller
 * Builds application header.
 */
 
$.about.addEventListener('click', function() {
    $.aboutAlert.message = "-- Powered By --\nTitanium Alloy\nAppcelerator ACS\n\nAuthor: " + Alloy.CFG.app.authorName + "\nEmail: " + Alloy.CFG.app.authorEmail + "\n\nVersion: " + Alloy.CFG.app.version + "\n\nIcons by Glyphish and Appcelerator";
    $.aboutAlert.show();
});

$.refresh.addEventListener('click', function() {
    
    // The refresh button will call globals for refreshing
    // on home and profile sections. This should be better.
    if ( Alloy.CFG.refreshRoars ) {
        Alloy.CFG.refreshRoars();
    }
    
    if ( Alloy.CFG.refreshProfileRoars ) {
        Alloy.CFG.refreshProfileRoars();
    }
        
});