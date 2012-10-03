//Static UI configuration
$.win.orientationModes = [
	Ti.UI.PORTRAIT,
	Ti.UI.UPSIDE_PORTRAIT
];

$.back.on('click', function() {
	$.win.close();
});

$.addView = function(view) {
	$.contentView.add(view);
};

$.open = function() {
	$.win.open();
};
