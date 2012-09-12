/**
 * nav Model
 * Responsible for section management.
 */
 
(function(Model) {
    var __changing = false;
    
    var __sections = {
        home: 'home',
        directory: 'directory',
        broadcast: 'broadcast',
        notifications: 'notifications',
        profile: 'profile'
    };
    
    var __currentSection     = __sections.home,
        __currentSectionView = null;
        
    var __sectionViews = [];
    
    function __setSectionViews( views ) {
        __sectionViews = views;
        
        __currentSectionView = __sectionViews[ 0 ]; // home
    }
    
    function __changeSection( section, sectionView, selection ) {
        
        if ( !__changing ) {
            __changing = true;
            
            __currentSectionView.opacity = 0.0;
            
            __currentSectionView = sectionView;
            
            __currentSectionView.opacity = 1.0;
            
            __currentSection = section;
            
            Ti.API.debug( 'Changing section to: ' + __currentSection );
        
            selection.view.animate({ left:selection.position, duration:250 }, function() {
                __changing = false;
            });
        } else {
            Ti.API.debug( 'Section is already changing.' );
        }
        
    }

	return Model.extend({
	    sections:        __sections,
	    currentSection:  __currentSection,
	    changeSection:   __changeSection,
	    setSectionViews: __setSectionViews
	});
	
})