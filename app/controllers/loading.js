$.loader.images = [
	'/img/loading/load-cloud1.png',
	'/img/loading/load-cloud2.png',
	'/img/loading/load-cloud3.png',
	'/img/loading/load-cloud4.png',
	'/img/loading/load-cloud5.png',
	'/img/loading/load-cloud6.png',
	'/img/loading/load-cloud7.png',
	'/img/loading/load-cloud8.png',
	'/img/loading/load-cloud9.png'
];

$.start = function() {
	$.loader.start();
};

$.stop = function() {
	$.loader.stop();
};

$.setMessage = function(key) {
	$.message.text = L(key);
};
