Object.create = function(o) {
	var F = function(){};
	F.prototype = 0;
	return new F();
};