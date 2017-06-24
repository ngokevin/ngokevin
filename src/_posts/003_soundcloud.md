---
title: "Scrape the Internet! Our Python Soundcloud API"
type: blog
layout: blog
date: 2011-11-06
id: soundcloud-api
tags: code

image:
    url: http://i.imgur.com/LZ35KEe.gif
    where: right
---

It was a cold November evening in the bullpen at Oregon State University.
[uberj](http://uberj.com) and ngoke were sipping tea and getting work done,
when the idea of an impromptu **hackthon** came into our minds. At the strike
of 5, we powered ourselves up into coding mode and set off to hack away at a
**Python Soundcloud API** that would allow us to download music from the
streams. Thus birthed [soundcloud-dl](http://github.com/ngokevin/soundcloud-dl).

---

We first attempted to use [Mechanize][mechanize] to scrape the pages. uberj had
previously used [Burp](http://portswigger.net/proxy) to monitor what requests
the browser was sending to Soundcloud and found that it was passing a "stream
token", which was needed to request the stream, and the song's "uid". And we
figured we needed to have a valid cookie as well. Security by obsurity much?

We ran into a slight hitch. We were able to compose a valid URL with the stream
token and the uid, but we weren't able to print out the cookies. We had to
enlist the help of [thedjpetersen](http://github.com/thedjpetersen), the master
screenscraper. It took him a bit to independently catch up to where we were (he
found out on his own that we needed a stream token, but we already grabbed
that).  After a bit of frustration on trying to check out what cookies we had
with every CookieJar known to man, thedjpetersen proclaimed that he had
successfully gotten the URL.

We rushed to pull his commit and tried it on a Mord Fustang song...we had the script write the stream to a file, and we opened it in VLC...The song had a length! Except it wasn't
playing. We tried to play it on uberj's machine...**and it worked!**. After a high-five
session and a burst of gratitude to thedjpetersen, we went to look what he did. He
found we had to request a page from a cross-domain, probably for cookies, and then
scrape the stream. We went off to wrap everything into a neat package and add
more functionality.

**and thus soundcloud-dl was born**

[mechanize]:wwwsearch.sourceforge.net/mechanize/
