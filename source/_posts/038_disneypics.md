---
title: Scraping for Free Disney Photopass Pictures
type: blog
category: blog
date: 2014-01-03
slug: "disney-photo"
tags: code

image:
    url: http://i.imgur.com/GNwD3OI.png
    where: top
    caption: Behold, Web Inspector.
---

**Update: an easier way to do this is open up Chrome's inspector and switch to
the network tab. As you click through your Photopass, you should be able to see
your images appear.**

A little bit of dirty digging can shovel you some decent rewards. I went to
Disneyland on New Year's Eve with my girlfriend where we had our pictures taken
with Mickey Mouse by a Disney photographer. We were given a little
[voucher](http://i.imgur.com/PpXwGfR.jpg) that contained a code which we could
use to view our pictures on.

### The Overcomeable Obstacle

**Note:** read the comments for updates on how to do this. The Disney site
changes from time to time.

After registering an account with the code, we browsed through our pictures. We
were presented with cropped, pixelated photos. Disney wanted $15 for a download
to our four photos. Not the most ludicrous of theme park deals, but I waited in
line for an hour to see Mickey Donald-duckin' Mouse for five seconds. I was
able to just to screen-grab the pictures, but I could stand for more.

*right-click, Save Image As* didn't pan out since the JS disabled
right-clicking. Disabling JS entirely would not either since the images were
being pulled in asynchronously. Either of these wouldn't have worked well
anyways since the images were pixelated and cropped.

---

### Discovering Disney's Photo API URL

So I jumped into Firebug/Web Inspector. I dove deeper than the depths of the
Mariana Trench and dug through layers and layers of DOM until I reached Middle
Earth. And there it was, the Holy Grail.

    ::html
    <td id="greyedImg"
        style="background: url("/api/photostore/previewEdits.pix?quality=80&ImageId=<XXX>...&cropAspectRatio=4x6...&Orientation=Landscape...&width=400");"...>

Turns out Disney was pulling in their photos through an API. Through the GET
query parameters, they limited the quality to 80 and width to 400 to decrease
the image quality in order to get people to chuck over some bucks. **dolan pls.**

To grab an image with decent quality, I changed ```quality``` to 100 and
```width``` to 1000. If the image had a portrait orientation, I would change
```orientation``` from ```landscape``` to ```portrait``` and swap the width and
height in```CropAspectRatio``` (e.g. 600x400 to 400x600). Finally, I added the
```http://www.disneyphotopass.com``` root to the API URL.

### The Resulting URL

    ::html
    http://www.disneyphotopass.com/api/photostore/previewEdits.pix?quality=100&ImageId=XXX&cropX=0.0025&cropY=0&cropWidth=0.995&cropOrientation=Landscape&cropAspectRatio=4x6&overlayAssetId=null&width=1000&Rotation=None&BlackAndWhite=false*

Just replace the XXX in ImageID with the one found in the Web Inspector.

Security through obscurity is not secure, although if I were Disney I wouldn't
care at all either for this case. Though there is something to be said about
the small benefits you can reap when you know the web.


[My personal resulting image.](http://i.imgur.com/SkCHQIA.jpg)
