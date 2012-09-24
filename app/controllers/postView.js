$.backdrop.on('click', function() {
	$.postFormView.blur();
	$.trigger('blur');
});

$.postFormView.on('blur', function() {
	$.trigger('blur');
});

$.postFormView.on('success', function() {
	$.postFormView.reset();
	$.postFormView.blur();
	$.trigger('success');
});

$.showForm = function(cb) {
	$.postContainer.animate({
		top:0,
		duration:250
	}, function() {
		$.postFormView.focus();
		cb && cb();
	});
};

$.hideForm = function(cb) {
	$.postContainer.animate({
		top:'-320dp',
		duration:250
	}, function() {
		cb && cb();
	});
};
