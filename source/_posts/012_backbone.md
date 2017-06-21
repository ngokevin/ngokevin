---
title: "Trek Into Backbone.js"
type: blog
category: blog
date: 2012-03-08
slug: backbone
tags: code

image:
    url: http://imgur.com/pKdaO.jpg
    where: right
---

This is a story of my Javascript image gallery, why I went with vanilla
Javascript, the countless hours I put into it, and why I'm rewriting it with
Backbone.js and jQuery.

---

The Javascript image gallery on my site has come a long way. Before I started
working on it several months ago, I had little Javascript experience. I had
only done a tiny jQuery-UI paginator and some exercises from Crockford's
"Javascript: The Good Parts" and [Eloquent
Javascript](http://eloquentjavascript.net). There were two motivations behind
building my own image gallery. First, it would be cool and I could use it to
post pictures to perhaps show my family what I've been up to since I'm all
grown-up and rarely home. Secondly, I really needed to level up my Javascript
skills Rocky-style before I headed down to Mozilla for a web development
internship.  What use is a web developer that doesn't know Javascript?

I started the trek into what I called "Javascript: The Final Frontier", a
mission to explore Javascript, to seek out new technologies, and to go where
most web devs have gone before. The gallery started out with pure vanilla white
Javascript. I was aware of this library called jQuery, but I am stubborn and
believed that was the easy way; I wanted to be "hardcore", really get my hands
dirty with the core of the language. Things definitely did get dirty.

Fast-forward. After countless hours hacking on it and gaining experience
(through pain) with Javascript, the image gallery and album viewer turned out
great! Well, at least on the frontend. I felt the code got sort of messy. Sure,
I had things pretty well modularized as best as I could, but there was no grand
structure. Some of the logic got complicated especially when trying to resize
images and center images; I had to know the size of the image before I could
properly transform it, but I don't know the size until it is loaded into the
DOM. There were became a lot of img.onload handlers.

Then, I heard about Backbone.js from the mentor,
[thedjpetersen](thedjpetersen.github.com). He had been using it to help write
his sleek persistent IRC web client
[Subway](http://lug.oregonstate.edu/blog/subway), which has exploded and gained
quite a following. Backbone.js gives an MVC structure to web applications.
Structure, you say? That's exactly what my gallery needed.

I have just recently started to begin learning it. It provides a nice
transition from vanilla Javascript to JQuery since I feel comfortable with
Javascript now. Combine that with a Python Wok hook I wrote, which
precalculates the image sizes and binds that data to the DOM, and the gallery
which be much more shinier.

On an off-note, I will try to make a blog post every day before I go to sleep.
I had been spending an hour or two every night before sleep watching Netflix, but
now I'm trying to faze out all mindless entertainment and use that time instead
for productive entertainment (blogging and hacking!).


