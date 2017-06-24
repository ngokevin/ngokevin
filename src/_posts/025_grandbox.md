---
title: "Grandbox, a Javascript Physics Sandbox"
type: blog
category: blog
date: 2012-08-15
id: grandbox
tags: code

image:
    url: http://imgur.com/Klb70.jpg
    where: top
---

Last month, I stayed up for over 24 hours straight for a Yahoo! hackathon where
I spawned [Grandbox](http://grandbox.ngokevin.com), an HTML5 Box2DWeb-powered
physics sandbox game. The goal was to create a side-scrolling platform game
where players could create their levels, and the idea was inspired by the video
games, LittleBigPlanet (a side-scrolling platformer where players create and
share levels) and Garry's Mod (a physics sandbox game). I wanted to learn what
it was somewhat like to create a game, even though I relied upon a Javascript
library to do a lot of the thinking for me. Since it's a web application and
therefore cross-platform, people could create levels on the desktop and play
them on mobile. Though I haven't gotten quite that far.

###The Features

After hacking for 24 hours solo, I got Grandbox to a presentable state that I
was quite proud of. It currently has a sandbox mode where you control little
pink ball that can roll around and jump. On the sidebar, there are objects that
you can add to the world that interact with the player and other objects. I
implemented a handful of objects such as balls, boxes, platforms, springboards,
and landmines. You can jump on these objects, push them around, or stack them
up. There's the option of setting different attributes of these objects such as
their size or bounciness. I was also able to work in a history widget where
objects that were added can be viewed, deleted, or even binded. Binding objects
together is somewhat like welding objects together, which can allow for some
pretty cool stuff.

###Demoing

I demo'ed Grandbox several times that week, once for Yahoo! and a couple times
for Mozilla. Each time, I tried to make a 'rocketship' that would launch our
little ball off-screen. I would create a little box around my ball, binding
them together. On the inside, I inserted an extremely bouncy springboard on the
ground. Then I dropped a ton of 'land mines' inside the rocketship, which
applies impulse to objects it contact. So the land mines would bounce off of
the springboard and hit the top of the inside of the rocketship, propelling it
upwards to infinity and beyond. I only got that demo to work the first time.

###What's Next

Clean up some collision bugs, write a JSON-serializer that
serializes the object history into a string and saves the world, write a
JSON-parser that parses that object history and loads the world, add more
components, and write my own Canvas renderer rather than using Box2DWeb's debug
renderer. Though I kinda doubt I'll have time to do any of that.

Building this in less than a day, I think this is a good testament as to how
easy and accessible it is to build for the web. Oh, and [source
code](http://github.com/ngokevin/grandbox).
