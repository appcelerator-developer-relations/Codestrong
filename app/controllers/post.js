/**
 * post Controller
 * Builds post UI and wires 
 * ROAR button for posting.
 * TODO: UI and functionality for 
 * content types.
 */
 
var __appWin = arguments[ 0 ],
    __roar   = Alloy.getModel( 'roar' );

$.roar.addEventListener('focus', function() {    
    
    $.parent.animate({ opacity:1.0, duration:250 }, function() {
        $.postContainer.animate({ opacity:1.0, duration:250 });
    });
    
});

$.roar.addEventListener('blur', function() {    
    
    $.postContainer.animate({ opacity:0.0, duration:250 }, function() {
        $.parent.animate({ opacity:0.0, duration:250 });
        __appWin.remove( $.parent );
    });
    
});

$.postBtn.addEventListener('click', function() {
    
    /*
    __roar.post(Alloy.CFG.currentUser.data.id, __roar.types.message, false, true, $.roar.value, function(e) {
        $.roar.blur();
        
        // Refreshes roars on both home and profile.
        // We should only have to make one call to update
        // all roars.
        Alloy.CFG.refreshRoars();
        Alloy.CFG.refreshProfileRoars();
    });
    */
});

__appWin.add( $.parent );

$.roar.focus();