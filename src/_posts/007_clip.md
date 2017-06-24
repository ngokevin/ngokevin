---
title: "An Easy Way to Trim Media Files"
type: blog
layout: blog
date: 2011-12-15
id: trim-media
tags: code
---

While working on extracting entertaining video clips from a feature-length home
movie I compiled a couple of years back, I learned of a way to trim media files
given timestamps from the command line. [ffmpeg](http://ffmpeg.org) is a large
library for working with media files, and I have also been using it in my
[mp3-Suite](http://github.com/ngokevin/mp3-Suite). The -ss option specifies the
starting timestamp of the trim and the -t option specifies the desired
duration.

ffmpeg -ss 00:00:15.00 -i input-file.mpg -t 30 -acodec copy -vcodec copy
output-file.mpg
