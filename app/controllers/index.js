/**
 * Alloy Hackathon 08/20/2012
 * Author: Fred Spencer
 * Email: fspencer@appceleator.com
 * == NOTES ==
 *     - There is repetitive code
 *       between profile and userDetail.
 *     - Some styles are not optimal.
 *     - Some model and controller methods
 *       should be in a different location.
 *     - GC hasn't been examined.
 *     - Had problems with widgets.
 *     - Not using 'controller events'.
 */

/**
 * index Controller
 * Builds and renders initial login context.
 * TODO: Drastically improve user creation.
 */
 
var __login     = Alloy.getModel( 'login' ),
    __animation = Alloy.getModel( 'animation' );

Alloy.CFG.currentWin = $.parent;

$.username.addEventListener('focus', function(e) {
    __login.onFocus( e, $.parent );
});

$.password.addEventListener('focus', function(e) {
    __login.onFocus( e, $.parent );
});

$.username.addEventListener('blur', function(e) {
    __login.onBlur( e, $.parent );
});
$.password.addEventListener('blur', function(e) {
    __login.onBlur( e, $.parent );
});

$.parent.addEventListener('click', function(e) {
    $.username.blur();
    $.password.blur();
});

$.loginBtn.addEventListener('click', function(e) {
    
    __login.login($.username.value, $.password.value, function(e) {
        
        __animation.zoom($.parent, function() {
            Alloy.getController( 'app' );
        });
        
    });
    
});

$.createBtn.addEventListener('click', function(e) {
    
    __login.create($.username.value, $.password.value, function(e) {
        
        __animation.zoom($.parent, function() {
            Alloy.getController( 'app' );
        });
        
    });
    
});

$.parent.addEventListener('open', function(e) {
    $.logo.animate({ top:"28dp", duration:250 });
    
    $.header.animate({ top:"265dp", opacity:0.0, duration:250 }, function() {
        
        $.loginInput.animate({ top:"206dp", opacity:1.0, duration:250 }, function() {
            $.createBtn.animate({ left:"33dp", opacity:1.0, duration:250 });
            $.loginBtn.animate({ right:"33dp", opacity:1.0, duration:250 });
        });
        
    });
    
});

// Open loader/login window.
// Delay for demo.
setTimeout(function() {
    $.parent.open();
}, 1000);