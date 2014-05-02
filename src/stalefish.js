/**
 * Stalefish
 */

var React = require('react/addons');
var TransitionGroup = React.addons.TransitionGroup;
var _ = require('lodash');

var Stalefish = function() {
	
};

Stalefish.extend = function() {
	var mergeArgs = Array.prototype.slice.call(arguments, 0);
	mergeArgs.unshift({}); // Add source to beginning
	return _.merge.apply(this, mergeArgs);
};

Stalefish.prototype.init = function(opts) {
	opts = opts || {};
	opts.container = opts.container || 'app-container';
	opts.layers = opts.layers || {};
	opts.layouts = opts.layouts || {};
	opts.layerClass = opts.layerClass || 'layer';
	opts.defaultView = opts.defaultView || 'defaultView';
	opts.innerContainer = opts.innerContainer || 'inner-container';
	this.opts = opts;
	this.specialProps = ['scale', 'x', 'y'];
	
	this.app = React.renderComponent(App({
		layers: this.opts.layers,
		layouts: this.opts.layouts,
		stalefish: this,
		innerContainer: this.opts.innerContainer,
		defaultView: this.opts.defaultView
	}), document.getElementById(opts.container));
};

Stalefish.prototype.changeLayout = function(layout) {
	this.app.setState({
		layout: layout
	});
};

Stalefish.prototype.createLayer = function(layer, key, parent, firstLayout, layoutName) {
	return (
		Layer(_.extend({}, parent.props.layers[key], layer, {
			name: key,
			key: layer.key || key,
			layers: parent.props.layers,
			layouts: parent.props.layouts,
			specialProps: this.specialProps,
			layerClass: this.opts.layerClass,
			stalefish: this,
			layout: layoutName,
			firstLayout: firstLayout
		}))
	);
};

var Layer = React.createClass({
	getInitialState: function() {
		return {
			attr: {},
			curtain: 'closed'
		};
	},
	defaultStyleProps: {
		x: 0,
		y: 0
	},
	getAttr: function(key) {
		var attr = this.props[key] ? this.props[key].attr : null;
		if(!attr) attr = this.props.layers[this.props.name][key] ? this.props.layers[this.props.name][key].attr : null;
		return attr;
	},
	changeLayout: function(layout) {
		this.props.stalefish.changeLayout(layout);
	},
	openCurtain: function(enter) {
		setTimeout(function() {
			this.setState({
				curtain: 'opening'
			}, function() {
				enter();
			});
		}.bind(this), 0);
	},
	closeCurtain: function() {
		this.setState({
			curtain: 'closing'
		}, function() {
			var delay = this.props.leaveDelay ? this.props.leaveDelay : 0;
			if(!delay) delay = this.props.layers[this.props.name].leaveDelay ? this.props.layers[this.props.name].leaveDelay : 0;
			setTimeout(function() {
				leave();
			}, delay);
		});
	},
	componentWillMount: function() {
		if(this.props.firstLayout) {
			this.openCurtain(function() {
				// TransitionGroup doesn't exist for elements
				// @todo — Have a default state with an empty div in the TransitionGroup?
			});
		}
	},
	componentWillLeave: function(leave) {
		this.closeCurtain(leave);
	},
	componentWillEnter: function(enter) {
		this.openCurtain(enter);
	},
	render: function() {
		var defaultStylePropsForLayer = this.props.layers[this.props.name].attr;
		var stylePropsForLayout = this.props.attr; // this.props.layouts[this.props.layout][this.props.name].attr;
		var stylePropsForCurtain = this.getAttr(this.state.curtain);

		var props = _.extend({}, this.defaultStyleProps, stylePropsForCurtain, defaultStylePropsForLayer, stylePropsForLayout);

		var translate = 'translate3d(' + props.x + 'px, ' + props.y + 'px, 0px)';
		var scale = 'scale(' + (typeof props.scale !== 'undefined' ? props.scale : 1) + ')';

		var children = (this.props.childLayers && _.map(this.props.childLayers, function(child, key) {
			return this.props.stalefish.createLayer(child, key, this, this.props.layout);
		}.bind(this))) || [];

		var style = {};
		for(var key in props) {
			if(this.props.specialProps.indexOf(key) === -1) {
				style[key] = props[key];
			}
		}

		// debugger;

		return (
			this.transferPropsTo(
				React.DOM.div(
					{
						className: this.props.name + ' ' + this.props.layerClass,
						style: _.extend({
							WebkitTransform: [translate, scale].join(' '),
						}, style)
					},
					TransitionGroup(
						{
							component: React.DOM.div
						},
						children
					)
				)
			)
		);
	}
});

var App = React.createClass({
	getDefaultProps: function() {
		return {
			layouts: [],
			layers: []
		};
	},
	getInitialState: function() {
		return {
			layout: this.props.defaultView
		};
	},
	componentWillMount: function() {
		this.layoutChanged = false;
	},
	componentWillUpdate: function(nextProps, nextState) {
		if(nextState.layout !== this.state.layout && !this.layoutChanged) {
			this.layoutChanged = true;
		}
	},
	render: function() {
		var layout = this.state.layout ? this.props.layouts[this.state.layout] : null;
		return React.DOM.div({
			className: this.props.innerContainer
		},
			(layout && TransitionGroup(
				{
					component: React.DOM.div
				},
				_.map(layout, function(layer, key) {
					return this.props.stalefish.createLayer(layer, key, this, !this.layoutChanged, this.state.layout);
				}.bind(this))
			))
		);
	}
});

module.exports = Stalefish;
window.Stalefish = Stalefish;