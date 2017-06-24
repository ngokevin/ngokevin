---
title: "Mock Unit Testing a AngularJS Local Storage Service with Karma and Jasmine"
type: blog
category: blog
date: 2014-01-21
id: angular-unit-testing
tags: [code, angularjs]

image:
    url: http://i.imgur.com/60Xnrfn.png

weight: 7
---

For a five-part introduction to AngularJS, check out my [ng-okevin's
Angular](/blog/angular-1).

I recently migrated my [AngularJS to-do list app](http://marketplace.firefox.com/app/minimalist)
to [AngularJS](http://angularjs.org), and I wanted
to unit test my Angular service that had a Local Storage schema migration.
My app had a
[service](https://github.com/ngokevin/minimalist/blob/060a3bbc082f10d8305ef97871911b20f073e472/media/js/services.js)
that abstracted all interactions with Local Storage and implemented an
interface to my list "model". In this service, I modified the
Local Storage schema, making it backwards-incompatible, so I wrote a migration.
To make sure it worked, I unit-tested the entire service.

---

To unit-test Angular, I used:

- [Karma](http://karma-runner.github.io/0.10/index.html) - a JS test runner
- [Jasmine](http://pivotal.github.io/jasmine/) - a JS testing framework
  (setups, teardowns, assertions), automatically installed with Karma
- [Angular Mocks](https://raw2.github.com/angular/angular.js/master/src/ngMock/angular-mocks.js) - to mock out our application

## Directory Structure

If you want to see for yourself my directory structure, check out
[the source code of my unit tests.](https://github.com/ngokevin/minimalist/tree/060a3bbc082f10d8305ef97871911b20f073e472/tests/unit_tests)

I keep a folder within my app called ```tests``` that makes room for both unit
tests and end-to-end tests.

    .
    |-- tests
    |   |-- e2e_tests
    |   |   |-- conf.js
    |   |   |-- minimalist_spec.js
    |   |   `-- selenium
    |   |       |-- chromedriver
    |   |       |-- selenium-server-standalone-2.37.0.jar
    |   |       `-- start
    |   |-- node_modules
    |   |   |-- karma
    |   |-- package.json
    |   |-- services.tests.js
    |   `-- unit_tests
    |       |-- karma.config.js
    |       |-- lib
    |       |   `-- angular-mocks.js
    |       `-- services.tests.js
    `--

## Setting Up the Karma Test Runner

Install Karma.

    npm install karma

Go into your unit test directory and initialize a configuration file. This will
lead you through an interactive shell.

    karma init karma.config.js

Look at your configuration file and make sure everything is correct. Things to
double-check are ```basePath```, ```files```, ```frameworks```, and
```browser```. Here is my
[Karma config](https://github.com/ngokevin/minimalist/blob/060a3bbc082f10d8305ef97871911b20f073e472/tests/unit_tests/karma.config.js)

- ```basePath``` - this will affect the paths in the ```files``` option. I recommend
             setting it to root of your app to be able to include the required
             angular.js which probably lies outside the test folder. I had it
             set to ```../../```.
- ```files``` - this loads files into the browser when testing. Make sure all necessary files
          are included. This option takes patterns with wildcards as well,
          something like ```{pattern: 'tests/unit_tests/*.js', included: true}```.
          Don't forget to include Angular Mocks.
- ```frameworks``` - set this to ```jasmine```. Don't know other frameworks, don't care.
- ```browser``` - since we're unit testing, generally set this to ```PhantomJS``` so
                 it doesn't pop up a browser every run.

Then we can start the Karma runner to run our tests.

    karma start karma.config.js

## Writing Jasmine Unit Tests

Jasmine unit tests, to me, are just like any other unit testing framework, but
more designed to be read like English. In essence it is the same, there are
test suites, test cases, setups, teardowns, and mocking. Here is
[my entire unit test for reference.](https://github.com/ngokevin/minimalist/blob/060a3bbc082f10d8305ef97871911b20f073e472/tests/unit_tests/services.tests.js)

The [Jasmine docs](http://pivotal.github.io/jasmine/) should be your primary
source for learning what the tests look like, but here is an excerpt from my
own.

    ::js
    describe('ItemService', function() {
        var store = {};
        var ls = function() {
            return JSON.parse(store.storage);
        };

        beforeEach(function() {
            // setUp.
            module('MinimalistApp');

            // LocalStorage mock.
            spyOn(localStorage, 'getItem').andCallFake(function(key) {
                return store[key];
            });
            Object.defineProperty(sessionStorage, "setItem", { writable: true });
            spyOn(localStorage, 'setItem').andCallFake(function(key, value) {
                store[key] = value;
            });
        });

        afterEach(function () {
            store = {};
        });

        it('migrate from legacy to version 0.', function() {
            store = {
                lastViewedList: 0,
                lists: ['sample', 'sample_two'],
                sample: {
                    id: 0,
                    list: [
                        {
                            id: 1,
                            items: ['item1', 'item2'],
                            rank: 2
                        },
                        {
                            id: 2,
                            items: ['item3', 'item4'],
                            rank: 1
                        }
                    ]
                },
                sample_two: {
                    id: 1,
                    list: [
                        {
                            id: 1,
                            items: ['item5'],
                            rank: 1,
                        }
                    ]
                },

            };
            localStorage.setItem('storage', JSON.stringify(store));

            inject(function(ItemService) {
                var sample = ItemService.getList(0);
                expect(sample.itemIndex.length, 2);
                expect(sample.items[0].text).toEqual('item3\nitem4');
                expect(sample.items[1].text).toEqual('item1\nitem2');

                sample = ItemService.getLists()[1];
                expect(sample.itemIndex.length, 1);
                expect(sample.items[0].text).toEqual('item5');
            });
        });
    });

### Initializing a Jasmine Test Suite

I'll describe portions of the code starting from the top.

    ::js
    describe('ItemService', function() {
        // ...
    });

### Setup and Mocking LocalStorage

This initializes our test suite for our module.

    ::js
    var store = {};
    beforeEach(function() {
        // setUp.
        module('MinimalistApp');

        // LocalStorage mock.
        spyOn(localStorage, 'getItem').andCallFake(function(key) {
            return store[key];
        });
        Object.defineProperty(sessionStorage, "setItem", { writable: true });
        spyOn(localStorage, 'setItem').andCallFake(function(key, value) {
            store[key] = value;
        });
    });

The setup called before each test case for initialization. We mock out our app
with Angular Mock's ```module``` to allow us to inject, or import, the modules or
pieces of our code that we wish to test.

Then we set up our Local Storage mock. we use Jasmine's ```spyOn``` to mock
```localStorage.getItem``` and ```localStorage.setItem```. This watches for
calls to these methods, and instead of calling the code it normally runs, it'll
instead call the function that we pass into ```andCallFake```. Here, the
functions we pass into ```andCallFake``` simply interact with a plain
Javascript object, ```store```. We have mocked our Local Storage with a
Javascript object, making infinitely easier to test. Everything is under our
control. If you wish to mock Local Storage as well, definitely steal this code
snippet.

    ::js
    afterEach(function () {
        store = {};
    });

### Jasmine Test Cases

The teardown called after each test case to reset the state. Here, we basically
clear our Local Storage.

    ::js
    it('migrate from legacy to version 0.', function() {
        // ...
    });

### Injecting Angular Modules

A single test case. The test case is created with ```it``` where we pass in  a
string describing the behavior we are testing and the test case itself.

    inject(function(ItemService) {
        var sample = ItemService.getList(0);
        expect(sample.itemIndex.length, 2);
        expect(sample.items[0].text).toEqual('item3\nitem4');
        expect(sample.items[1].text).toEqual('item1\nitem2');

        sample = ItemService.getLists()[1];
        expect(sample.itemIndex.length, 1);
        expect(sample.items[0].text).toEqual('item5');
    });

After some test case setup code, we finally get to the juicy test assertions.
We call Angular Mock's ```inject``` to import our service into the test case. I
assume the Angular app module namespace is searched to pull out the module so
make sure the parameter name matches what we want to import.

### Jasmine Assertions

To run a basic assertion, we call Jasmine's ```expect```, passing in the first
value, and then ```toEqual``` to assert that its value is equivalent to what we
expect. Jasmine is interesting how everything is modeled after being an English
sentence.

That's all. For additional resources, check out [this
guide](http://www.tuesdaydeveloper.com/2013/06/angularjs-testing-with-karma-
and-jasmine/) and [my app's source
code](http://github.com/ngokevin/minimalist). I will soon be writing about
how to write end-to-end (E2E) tests for Angular apps with Protractor.
