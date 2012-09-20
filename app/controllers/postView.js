$.backdrop.on('click', function() {
	$.post.blur();
	$.trigger('blur');
});

$.post.on('blur', function() {
	$.trigger('blur');
});

$.showForm = function(cb) {
	$.postContainer.animate({
		top:0,
		duration:250
	}, function() {
		$.post.focus();
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
