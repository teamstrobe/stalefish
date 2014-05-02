var Stalefish = require('../../src/stalefish');

// An example of 'curtain states',
// utilised as a mixin, so it could be extended into multiple objects.
var FadeInAndOutMixin = {
	closed: { attr: { opacity: 0 } },
	opening: { attr: { opacity: 1 } },
	closing: { attr: { opacity: 0 } },
	leaveDelay: 500
};

// You can also use common styles in mixins too
var BoxMixin = Stalefish.extend({
	attr: {
		width: 150,
		height: 100,
		backgroundColor: 'blue',
		x: (320 / 2) - (150 / 2)
	}
}, FadeInAndOutMixin);

var ActiveBoxMixin = {
	attr: {
		scale: 1.5
	}
};

var myApp = new Stalefish();
myApp.init({
	layers: {
		Background: { attr: { width: '100%', height: '100%' }, onClick: function(event) { event.stopPropagation(); myApp.changeLayout('defaultView'); } },
		Box1: Stalefish.extend({attr: { y: 50 }, onClick: function(event) { event.stopPropagation(); myApp.changeLayout('Box1Active'); }}, BoxMixin),
		Box2: Stalefish.extend({attr: { y: 200 }, onClick: function(event) { event.stopPropagation(); myApp.changeLayout('Box2Active'); }}, BoxMixin),
		Box3: Stalefish.extend({attr: { y: 350 }, onClick: function(event) { event.stopPropagation(); myApp.changeLayout('Box3Active'); }}, BoxMixin)
	},
	layouts: {
		defaultView: {
			Background: {
				childLayers: {
					Box1: { },
					Box2: { },
					Box3: { }
				}
			}
		},
		Box1Active: {
			Background: {
				childLayers: {
					Box1: Stalefish.extend(ActiveBoxMixin),
					Box2: { },
					Box3: { }
				}
			}
		},
		Box2Active: {
			Background: {
				childLayers: {
					Box1: { },
					Box2: Stalefish.extend(ActiveBoxMixin),
					Box3: { }
				}
			}
		},
		Box3Active: {
			Background: {
				childLayers: {
					Box1: { },
					Box2: { },
					Box3: Stalefish.extend(ActiveBoxMixin)
				}
			}
		}
	}
});