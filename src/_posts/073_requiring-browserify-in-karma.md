---
title: "Testing Project Browserify Modules in Karma Test Runner with Gulp"
type: blog
category: blog
date: 2014-08-31
id: requiring-browserify-in-karma
tags: [code]
---

If you want to test local Browserify modules in your project with
[Karma](http://ngokevin.com/blog/angular-unit-testing/), you'll have to take an
extra step. One solution is to use
[karma-browserify](https://github.com/xdissent/karma-browserify) that bundles
your modules with your tests, but it has [downfalls requiring files that
require other files](https://github.com/xdissent/karma-browserify/issues/38).
That really sucks since we'll often be unit testing local modules that depend
on at least one other module, and thus it'd only be useful for like requiring
simple NPM modules.

Another solution uses ```Gulp``` to manually build a
test bundle and put it on the project JS root path such that local modules
can be resolved.

---

Here is the Gulp task in our ```gulpfile.js```:

    ::js
    var browserify = require('browserify');
    var glob = require('glob');  // You'll have to install this too.

    gulp.task('tests', function() {
        // Bundle a test JS bundle and put it on our project JS root path.
        var testFiles = glob.sync('./tests/**/*.js');  // Bundle all our tests.
        return browserify(testFiles).bundle({debug: true})
            .pipe(source('tests.js'))  // The bundle name.
            .pipe(gulp.dest('./www/js'));  // The JS root path.
    });

A test bundle, containing all our test files, will be spit out on our JS root
path. Now when we do ```require('myAppFolder/someJSFile')```, Browserify will
easily be able to find the module.

But we also have to tell Karma where our new test bundle is. Do so in our
```karma.config.js``` file:

    ::js
    files: [
        {pattern: 'www/js/tests.js', included: true}
    ]

We'll also want to tell Gulp to re-bundle our tests every time the tests are
touched. This can be annoying if you have Gulp set up to watch your JS path,
since the tests will spit out a bundle on the JS path

    ::js
    gulp.watch('./tests/**/*.js', ['tests']);

Run your tests and try requiring one of your project files. It should work!
