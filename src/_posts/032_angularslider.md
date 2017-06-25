---
title: "AngularJS Directive for Mobile Sliders"
type: blog
layout: blog
date: 2013-04-11
id: angularslider
tags: [code, angularjs]

image:
    url: http://i.imgur.com/JM0yS3I.jpg
    where: top

weight: 6
---

{% raw %}
<div ng-app="demo" class="demo" style="margin-bottom: 26px;">
  <b>Value:</b> <span>{{ sliderVal || 9001 }}</span>
  <div slider class="slider" min="0" max="9001" step="10"><span></span></div>
</div>
{% endraw %}

For a five-part introduction to AngularJS, check out [ng-okevin's
Angular](/blog/angular-1).

I ditched jQuery Mobile's sliders for my growing AngularJS [poker
app](http://github.com/ngokevin/underthegun). It had served as the app's poker
bet slider. All I wanted was a simple slider widget from jQuery Mobile, but the
UI framework wanted me to marry it in return. It had its way with my HTML
markup, littering my DOM elements with selfish classes and attributes, like
an open garbage truck on the freeway. My CSS rules felt oppressed like liberal
college students as jQuery Mobile's CSS files applied forceful rules my
top-level ```html``` and ```body``` elements. The kicker? The slider quickly
became deprecated, not working on newer versions of Firefox.  Never even saw it
work on Chrome.

---

## AngularJS Directives

My disappointment digresses. The point is: I assembled my own customizable
mobile slider that hooked into AngularJS in the form of a directive. Let us
begin with the HTML, which AngularJS enhances with declarative two-way bindings.

```html
<div slider class="slider" min="0" max="9001" step="10">
  <span></span>
</div>
```

Unfortunately, this is not the most exciting display of AngularJS's abilities.
Though by giving the element my ```slider``` attribute, I make the element a
template for our AngularJS directive named ```slider```, which is where all the
magic will happen. There are other ways to syntactically bind the directive to
the element through the ```restrict``` parameter, we even make it look like a
```<slider>``` tag. Note that the following Javascript code snippets are parts
of a whole.

```js
var myApp = angular.module('my-app',['my-app.directives']);

var directives = angular.module('my-app.directives', []);
directives.directive('slider', function() {
    return {
        link: function(scope, element, attrs) {
            // Linking function.
            // {{ initialize }}
            // {{ event handler }}
            // {{ scope updater }}
            // {{ scope watcher }}
        }
    };
});
```

Directives teach HTML new tricks, allowing us to write reusable components and
widgets. The link function allows us to register event handlers and watches on
the scope, all binded to our template. ```link``` supplies the AngularJS scope,
the element acting as the directive template, and attributes of the element.

##Initialize

Let us get some initialization out of the way.

```js
// Linking function.
var $element = $(element);
var $bar = $('span', $element);
var step = attrs.step;

var width;
var offset;

var mouseDown = false;
element.on('mousedown touchstart', function(evt) {
    mouseDown = true;
    if (!width) {
        width = $element.width();
    } if (!offset) {
        offset = $bar.offset().left;
    }
});

element.on('mouseup touchend', function(evt) {
    mouseDown = false;
});
```

This just allows us to determine whether the user is currently dragging the
slider with a click or touch.

##Event Handler

Whenever the user drags the slider, we want to update its binded scope value.
Vice-versa, whenever the binded scope value changes, we want to visually
update the slider's fill.

```js
// Throttle function to 1 call per 25ms for performance.
element.on('mousemove touchmove', _.throttle(function(evt) {
    if (!mouseDown) {
        // Don't drag the slider on mousemove hover, only on click-n-drag.
        return;
    }

    // Calculate distance of the cursor/finger from beginning of slider
    var diff;
    if (evt.pageX) {
        diff = evt.pageX - offset;
    } else {
        diff = evt.originalEvent.touches[0].pageX - offset;
    }
```

Above is the math driving the slider. We want to calculate how far the slider
is dragged relative to the max value of the slider, in terms of a percentage.

##Scope Updater

We then take that percentage of the max value to attain the slider's value.
That value is then applied to the scope.

```js
    // Allow dragging past the limits of the slider, but impose min/max values.
    if (diff < 0) {
        scope.sliderValue = attrs.min;
        $bar.width('0%');
    } else if (diff > width) {
        scope.sliderValue = attrs.max;
        $bar.width('100%');

    // Set the value to percentage of slider filled against a max value.
    } else {
        var percent = diff / width;
        $bar.width(percent * 100 + '%');
        scope.sliderValue = Math.round(percent * attrs.max / step) * step);
    }

    // Let all the watchers know we have updated the slider value.
    scope.$apply();
}, 25));
```

We have enough to calculate the slider's value. We set the width of the inner
span to create the visual effect of the slider, and update the scope's slider
value.

##Scope Watcher

This accomplishes one-way data binding; if we change the slider, we
change the slider's value in the scope. But we also need to account for if the
slider's value in the scope is changed somewhere else, we need to visually
update the slider. We accomplish this by registering a watcher on the scope.

```js
scope.$watch('sliderValue', function(sliderValue) {
    $bar.width(sliderValue / attrs.max * 100 + '%');
});
```

When the slider's value in the scope is updated somewhere else, the watcher
will trigger our callback function. We change the slider's fill percentage to
respectively match the new slider value.

##CSS

Setting the width of the inner span changes the fill of the slider.

```scss
.slider {
    @include box-shadow(inset 0 -1px 1px rgba(255,255,255,0.3));
    background: rgb(10, 10, 10)
    border-radius: 5px;
    height: 20px;
    padding: 10px;
    position: relative;
    > span {
        @include gradient(rgb(43,194,83) 37%, rgb(84,240,84) 69%);
        @include box-shadow(
            inset 0 2px 9px  rgba(255,255,255,0.3)\,
            inset 0 -2px 6px rgba(0,0,0,0.4)
        );
        background-color: rgb(43,194,83);
        border-radius: 20px 8px 8px 20px;
        font-weight: bold;
        display: block;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
}
```

To view the code, inspect the code for this page as I inlined it in the HTML.

## Up Next

By now you might have started on your own sweet AngularJS app. But testing is
an important part of development. How to test such an opinionated framework?
Check out my post on [Mock Unit Testing AngularJS Services with Karma and
Jasmine](/blog/angular-unit-testing).

<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular.min.js"></script>
<script src="http://underscorejs.org/underscore-min.js"></script>
<script type="text/javascript">
    demo = angular.module('demo',['demo.directives']);
    angular.module('demo.directives', []).directive('slider', function() {
        return {
            link: function(scope, element, attrs) {

                var $element = $(element);
                var width = $element.width();
                var $bar = $('span', $element);
                var offset = $bar.offset().left;

                var mouseDown = false;
                element.on('mousedown touchstart', function(evt) {
                    mouseDown = true;
                });

                element.on('mouseup touchend', function(evt) {
                    mouseDown = false;
                });

                element.on('mousemove touchmove', _.throttle(function(evt) {
                    evt.preventDefault();
                    if (!mouseDown) {
                        return;
                    }
                    var diff;
                    if (evt.pageX) {
                        diff = evt.pageX - offset;
                    } else {
                        diff = evt.originalEvent.touches[0].pageX - offset;
                    }

                    if (diff < 0) {
                        scope.sliderVal = attrs.min;
                        $bar.width('0%');
                    } else if (diff > width) {
                        scope.sliderVal = attrs.max;
                        $bar.width('100%');
                    } else {
                        var percent = diff / width;
                        $bar.width(percent * 100 + '%');
                        scope.sliderVal = (
                            Math.round(percent * attrs.max / attrs.step) *
                            attrs.step);
                    }
                    scope.$apply();
                }, 25));

                scope.$watch('sliderVal', function(sliderVal) {
                    $bar.width(sliderVal / attrs.max * 100 + '%');
                });
            }
        };
    });
    demo.run();
</script>
<style>
    .slider {
        -moz-box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
        -webkit-box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
        box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);
        background: rgb(10, 10, 10);
        border-radius: 5px;
        height: 20px;
        padding: 10px;
        position: relative;
    }
    .slider > span {
        background-color: #54f054 69%;
        background-image: -webkit-gradient(linear, left bottom, left top, from(#2bc253 37%), to(#54f054 69%));
        background-image: -webkit-linear-gradient(#2bc253 37%, #54f054 69%);
        background-image: -moz-linear-gradient(#2bc253 37%, #54f054 69%);
        background-image: -ms-linear-gradient(#2bc253 37%, #54f054 69%);
        background-image: -o-linear-gradient(#2bc253 37%, #54f054 69%);
        background-image: linear-gradient(#2bc253 37%, #54f054 69%);
        -moz-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3) \, inset 0 -2px 6px rgba(0, 0, 0, 0.4);
        -webkit-box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3) \, inset 0 -2px 6px rgba(0, 0, 0, 0.4);
        box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3) \, inset 0 -2px 6px rgba(0, 0, 0, 0.4);
        background-color: #2bc253;
        border-radius: 20px 8px 8px 20px;
        font-weight: bold;
        display: block;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
</style>
