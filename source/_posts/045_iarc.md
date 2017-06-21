---
title: "Content Ratings on the Firefox Marketplace (Rated E for Everyone)"
type: blog
category: blog
date: 2014-02-08
slug: iarc
tags: code

image:
    url: http://imgur.com/2yA1a4z.jpg
    caption: You may have seen these before, on all your lovely digital products.
---

Our little webapp marketplace is growing up so quickly. Over the last past two
and a half months, [robhudson](http://github.com/robhudson) and I have been
working with the [ESRB](http://www.esrb.org/index-js.jsp) (Entertainment
Software Rating Board) to integrate their new International Age Rating
Coalition (IARC) system into the Firefox Marketplace. IARC is a system that
unifies multiple age rating systems respective to different countries to make
it simpler for content creators to obtain a content rating for their products.

For those not familiar with age-based content ratings, they are most popularly
known for their use in games and movies, such as *Rated M for Mature for
Violence* or *Suitable for Ages 13 and Up*. The Firefox Marketplace has become
the **first storefront** to implement IARC, and as such it was a bit of a new
experience for both parties. We both grew up together; we tackle becoming a
full-fledged store, and they prepare to fry larger fish (i.e. Nintendo or
Sony).

---

For some background, FirefoxOS recently [launched in Brazil and
Germany](https://blog.mozilla.org/about_mozilla/2013/10/24/firefox-os-launches-in-brazil-germany-your-name-on-the-mozillians-monument-and-more/)
in late 2013. Brazil and Germany have strict and legal age rating requirements
for digitally-distributed games, with laws requiring self-rating through an
approved age rating system (i.e. [CLASSIND](http://culturadigital.br/classind/)
for Brazil or [USK](http://www.usk.de/) for Germany). Our Marketplace, in order
to list the games in those regions, had to display content ratings for those
games. Before implementing IARC, we built a temporary system that allowed our
app reviewers to manually enter in content ratings for individual games that
were only applicable to Brazil and Germany. Now with IARC, developers can
obtain content ratings on their own which are applicable to all regions.

Developers are led from the Marketplace through an IARC portal where they can
fill out a yes/no questionnaire that inquires about the content of their app
(e.g. *Does it contain violence?*, *Does it contain crude humor*). Although
the app is self-rated, IARC will occasionally do spot-checks and manually
update the rating. Marketplace app reviewers may also spot any inconsistencies
between the app's rating and the app's content.

Upon filling out the form, developers are redirected back to the Marketplace
where their content rating will be registered to their app by both Marketplace
and IARC. If the developer ever released their app on another storefront,
their rating would conveniently follow that product. When people visit their
app's listing page on the Marketplace, they will be able to read all about the
its content rating.

![App with content ratings](http://i.imgur.com/rd9477d.png)

<div class="page-caption"><span>
Minimalist, an app with content ratings on the Firefox Marketplace.
</span></div>

We organized development in this [Bugzilla tracking
bug](https://bugzilla.mozilla.org/show_bug.cgi?id=929812). Throughout
development, ESRB has been very responsive with communication, in making sure
our system was correctly implemented and in ironing out bugs on their side.
Currently, the IARC supports the ESRB, [PEGI](http://www.pegi.info/en/index/),
CLASSIND, and USK rating systems. [More will likely
follow](http://en.wikipedia.org/wiki/Video_game_content_rating_system#Rating_systems).
