// album.js
// displays thumbnails of images and full-size image onclick of thumbnails

var THUMBNAIL_PREFIX = 'THUMB_';

// function: getImages
// grab image objects from template and return array
var getImages = function() {

    // retrieve slug to determine what directory album is in
    var slug = document.getElementById('album-slug').innerHTML;
    var album_url = "/images/gallery/" + slug + "/";

    // make request to index of album directory
    var request = makeHttpObject();
    request.open("GET", album_url , false);
    request.send(null);
    var html = request.responseText;

    // query apache index to get image srcs and push to array
    var image_regex = new RegExp('href="(' + THUMBNAIL_PREFIX + '.*.(jpg|png|JPG))"', 'gi');
    var images = new Array();
    while (match = image_regex.exec(html)) {

        var a = document.createElement("a");
        var img = document.createElement("img");
        img.src = album_url + match[1];

        img.onclick = showImage;
        img.onmouseover = expandImage;

        a.appendChild(img)
        images.push(a);
    }
    return images;
}


// event handler: showImage
// ONCLICK for a thumbnail that displays full size image over an overlay
var showImage = function() {

    var thumb_img = this;

    // closure holds thumbnail_prefix
    return show = function() {

        // create overlay and append to page
        var overlay = document.createElement("div");
        overlay.setAttribute("id","overlay");
        overlay.setAttribute("class", "overlay");
        document.body.appendChild(overlay);

        // disable scrolling with overlay
        document.body.style.overflow = "hidden";

        // create image and append to page
        var img = document.createElement("img");
        img.setAttribute("id","overlay-img");
        img.src = thumb_img.src.replace(THUMBNAIL_PREFIX, '');
        img.setAttribute("class","overlay-img");

        // click to restore page
        img.onclick = restoreImage;
        overlay.onclick = restoreImage;

        document.body.appendChild(img);
    }();
}


// event handler: restoreImage
// ONCLICK for full-size image and overlay that restores to album page
var restoreImage = function() {
   document.body.removeChild(document.getElementById("overlay"));
   document.body.removeChild(document.getElementById("overlay-img"));
   document.body.style.overflow = "visible";
}


// event handler: expandImage
// ONMOUSEOVER to show full-res image on top of thumbnail
var expandImage = function() {

    var thumb_img = this;

    return expand = function() {

        var expand = document.createElement("div");
        expand.setAttribute("id","expand");
        expand.setAttribute("class", "expand");
        document.body.appendChild(expand);

        // add full img OVER thumb image
        position = getXYpos(thumb_img);

        // create img for full-res image
        img = new Image();
        img.src = thumb_img.src.replace(THUMBNAIL_PREFIX, '');
        img.style.position = 'absolute';
        img.style.left = position['x'] + 'px';
        img.style.top = position['y'] + 'px';
        img.style.width = thumb_img.width * 1.4;
        img.style.height = thumb_img.height * 1.4;

        // restore back on mouseout of full image
        img.onmouseout = function() {
            document.body.removeChild(document.getElementById("expand"));
        }

        expand.appendChild(img);

    }();
}


// function: insertImages
// add images to DOM
var insertImages = function(images) {
    var album = document.getElementById("album");
    for (var index in images) {
        album.appendChild(images[index]);
    }
}


images = getImages();
insertImages(images);

