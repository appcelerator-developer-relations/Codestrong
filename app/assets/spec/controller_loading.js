//Setup module to run Behave tests
require('behave').andSetup(this);

describe('the "loading" view controller', function() {
	var loading = Alloy.createController('loading');
	
	it('creates an image view with nine images', function() {
		expect(loading.loader.images.length).toBe(9);
	});
	
	it('has a configurable message', function() {
		loading.setMessage('codestrong');
		expect(loading.message.text).toBe('Codestrong');
	});
});