//Setup module to run Behave tests
require('behave').andSetup(this);

describe('The UI helper package', function() {
	var ui = require('ui');
	
	it('creates a view with a gray background for a drop shadow', function() {
		var s = new ui.FauxShadow();
		
		expect(s.backgroundColor).toBe('#9a9a9a');
		expect(s.bottom).toBe(0);
		expect(s.bottom).notToBe(100);
	});
});

