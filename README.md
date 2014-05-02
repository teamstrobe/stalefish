# STALEFISH

**A WORK-IN-PROGRESS tool for prototyping your apps, based on React.js**

## Features

+ Declarative prototype layouts: define layouts, and React will diff between states.
+ State machine for different layouts
+ Opening/closing attributes on layers

---

## Documentation

### Prerequisites

*You don't necessarily need to *know JS* to use Stalefish. And, hopefully, soon it'll be completely automated into your GUI workflow.*

+ For configuration: Construction of a JavaScript object. (Similar to JSON, but more flexible)
+ For basic behaviour: simple understanding of React.js events.

### Initialising

**Create a new instance** of Stalefish first, so that you have access to the instance when initialising the app

`var stalefish = new Stalefish()`

**Initialise the app**. The following parameters are required...

```javascript
stalefish.init({
	layers: {
		// A flat list of layers in your prototype. Make sure they're all here.
		// You can also use this to store global attributes, that are accessible from any layout
		// e.g. Background: { attr: { width: '100%', height: '100%' } }
	},
	layouts: {
		// A hierarchy tree for each state of your prototype.
		// An object with the key `defaultView` is the *default* default view ;-)
		// e.g. You'd do this to have a second layout state, where the background turns red
		// but Utilises the *same* object, via a DOM diff in React.js
		// defaultView: {
		// 	Background: { }
		// },
		// myOtherView: {
		// 	Background: { attr: { backgroundColor: 'red' } }
		// }
	}
})
```

... see **"Changing the current layout"** below how to actually switch from `defaultView` to `myOtherView`...

### Layers

There's plenty of things you can pass into layers config objects.

##### Style Attributes

Style attributes are defined through the `attr` key in a layer config object.

+ **Special style attributes**: `scale`, `x`, and `y` all render using `WebkitTransform`. 
+ **All other style attributes** that are used in React are also supported, e.g. `opacity`

##### Opening / closing attributes

You can override style attributes for when the layer is appearing or disappearing from the DOM.

```javascript
{
	layers: {
		Box: {
			closed: { attr: { opacity: 0 } },
			opening: { attr: { opacity: 1 } },
			closing: { attr: { opacity: 0 } },
			leaveDelay: 500
		}
	}
}
```

... this example would result in a fade-in when it appears, and a fade-out before it is removed.

Set `leaveDelay` to whatever your CSS transition duration is.

##### Child layers

You can nest your layers when using layouts, which will reset the x/y origin

```javascript
layers: {
	Box: { attr: { width: 50, height: 50 }},
	Background: { attr { width: '100%', height: '100%' }},
},
layouts: {
	defaultView: {
		Background: {
			childLayers: {
				Box: { }
			}
		}
	}
}
```

##### Other attributes

+ Anything you pass into the configuration will get passed right down React's component tree, to the `div` that is representing the layer. So event handlers like `onClick` work fine.

### Layouts

##### Layout overrides

You can override properties of a layout, by simply defining a new object. It will automatically inherit from the layer of the same name.

```javascript
layers: {
	Box: { attr: { width: 50, height: 50 } },
},
layouts: {
	defaultView: {
		Box: { } // Standard box
	},
	zoomView: {
		Box: { attr: { width: 100, height: 100 }} // There's still the same box, but it's TWICE AS BIG!
	}
}
```

##### Changing the current layout

Your stalefish app instance has a method called `changeLayout` to switch the layout state to something else.
You can utilise this in your configuration block, e.g.

```javascript
{
	layers: {
		Background: {
			onClick: function(event) {
				stalefish.changeLayout('myOtherView')
			}
		}
	}
}
```

### Mixin trick

Because the configuration of `layers` and `layouts` is just a JavaScript object, you can extend your heart away. There's even a `Stalefish.extend` to make it even easier.

```javascript
var blueBgMixin = { attr: { background: 'blue' } };
// ...
{
	layers: {
		Box: Stalefish.extend(blueBgMixin, { atr: { width: 50, height: 50 } })
	}
}
```

---

## Get started

### Play with the demo

1. `git clone git@github.com:joecritch/stalefish.git`
2. Fire-up a static server, pointing to `/examples/first-example` (`npm install -g http-server` is recommended)
3. Play with the demo
4. See how it works by going to `/examples/first-example/app.js` and `/examples/first-example/index.html`

### Use it yourself

1. Make an HTML page, using `/examples/first-example/index.html` for inspiration
2. Add stalefish to your project root — `npm install git+ssh://git@github.com/joecritch/stalefish.git`
3. Point a script tag to `dist/stalefish.js`, or utilise it as an npm module

---

## Other shiz

######Roadmap!

+ Cover all CSS styles (e.g. rotate, 3d)
+ Sketch / Photoshop integration?
+ Reactive animations?

###### Inspired by...

+ Framer.js
+ Both my react-layout and framer-director projects

###### Practically impossible without...

+ React.js <3

###### Stalefish??

I dunno! I just looked up some Tony Hawk's Pro Skater tricks.

