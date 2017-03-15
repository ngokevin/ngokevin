/*
    Displays thumbnails of images.
    Displays full-size images on click and hover.
*/
(function($) {

var MARGIN = 3;
var PAGE_WIDTH = $('.main').width();


var Image = Backbone.Model.extend({
    defaults: {
        'id': 0,

        'thumbSrc': '',
        'thumbWidth': 0,
        'thumbHeight': 0,

        'src': '',
        'width': 0,
        'height': 0,

        'viewed': false,
    }
});


var Images = Backbone.Collection.extend({

    model: Image,

    viewed: function() {
        /* Get inserted Images. */

        var self = this;
        return self.filter(function(image) {
            return image.get('viewed');
        });
    },

    unviewed: function() {
        /* Get uninserted Images. */
        var self = this;
        return self.reject(function(image) {
            return image.get('viewed');
        });
    },

    getBySrc: function(src) {
        /* Get model by src. */
        var self = this;
        return self.filter(function(image) {
            return [image.get('src'), image.get('thumbSrc')].indexOf(src) !== -1;
        });
    },

    getById: function(id) {
        /* Get model by id. */
        var self = this;
        return self.filter(function(image) {
            return image.id == id;
        });
    },

    nextUnviewed: function() {
        /* Iterator for uninserted images, get next unviewed, set as viewed. */
        var image = this.unviewed()[0];
        if (typeof image == "undefined") {
            return null;
        }
        this.get(image['id']).set('viewed', true);
        return image;
    },

    prev: function(image) {
        /* Get previous image in collection. */
        if (image.get('id') === 0) {
            return this.models[this.length - 1];
        }
        return this.models[image.get('id') - 1];
    },

    next: function(image) {
        /* Get next image in collection. */
        if (image.get('id') === this.length - 1) {
            return this.models[0];
        }
        return this.models[image.get('id') + 1];
    }
});


window.AlbumView = Backbone.View.extend({

    el: $('#album'),

    initialize: function() {
        /* Parse image metadata from JSON inserted by Python hooks.
           Insert initial rows, set up endless scrolling. */
        this.images = new Images();
        this.imageList = jQuery.parseJSON($('#images').text());

        this.createImages();

        var self = this;
        self.imageList = this.imageList;
        $(window).scroll(_.throttle(function() {
          self.endlessScroller();
        }, 100)).resize({'view': this}, this.reinitialize);
        this.insertRows();
        this.initOverlay();

        if (window.location.hash) {
            // Try to load hash.
            var id = window.location.hash.split('#')[1];
            if (id) {
                var image = this.images.getById(id);
                if (image) {
                    self.showImage.apply(image[0], [{data: {view: this}}]);
                }
            }
        }
    },

    reinitialize: function(event) {
        if (PAGE_WIDTH == $('.main').width()) {
            // Don't do it if only the height changes.
            return;
        }

        PAGE_WIDTH = $('.main').width();
        var view = event.data.view;
        view.$el.find('img').remove();
        view.images.forEach(function(model, index) {
            model.set('viewed', false);
        });
        view.insertRows();
    },

    createImages: function() {
        /* From image metadata, initialize Image models and add to Collection. */
        var self = this;
        $(this.imageList).each(function(index, img) {
            var image = new Image({
                'id': index,

                'thumbSrc': img.thumb_src,
                'thumbWidth': img.thumb_width,
                'thumbHeight': img.thumb_height,

                'src': img.src,
                'width': img.width,
                'height': img.height,

                'viewed': false,
            });
            self.images.add(image);
        });
    },

    createImg: function(src) {
        /* Given src, create img element. */
        var img = $('<img />');
        img.attr('src', src);
        img.addClass('thumb-img');

        var self = this;
        // If mobile, no expand-on-hover. Just clicks.
        img.click(function() {
            self.showImage.apply(
                self.images.getBySrc(src)[0], [{data: {view: self}}]
            );
        });
        return img;
    },

    insertRow: function() {
        /* Insert row of even-height thumbnails fitting width of page. */
        var self = this;
        var models = [];  // Backbone model representation.
        var row = [];  // DOM representation.
        var currentRowWidth = 0;

        // Fill row with enough images to at least fill the page width.
        while (currentRowWidth < PAGE_WIDTH || self.images.unviewed().length <= 2) {
            var image = self.images.nextUnviewed();

            if (image === null && currentRowWidth === 0) {
                return;
            } else if (image === null) {
                break;
            }

            models.push(image);
            row.push(self.createImg(image.get('thumbSrc')));
            currentRowWidth += image.get('thumbWidth');
        }

        // Scale images to equal height, based on smallest height.
        var smallestHeight = models[0].get('thumbHeight');
        $(models).each(function(index, image) {
            var height = image.get('thumbHeight');
            if (height < smallestHeight) {
                smallestHeight = height;
            }
        });
        currentRowWidth = 0;
        $(row).each(function(index, img) {
            var width = models[index].get('thumbWidth');
            var height = models[index].get('thumbHeight');

            var scale = smallestHeight / height;
            width = Math.floor(width * scale);
            img.width(width);
            img.height(Math.floor(height * scale));

            currentRowWidth += width;
        });

        // Factor in margins of images when calculate scale.
        var marginsWidth = models.length * MARGIN * 2;

        // Fit row to page width.
        var scale = (PAGE_WIDTH - marginsWidth) / currentRowWidth;
        $(row).each(function(index, img) {
            var width = img.width();
            var height = img.height();

            img.width(Math.floor(width * scale));
            img.height(Math.floor(height * scale));
        });

        // Wrap img in anchor and insert into page.
        self = this;
        $(row).each(function(index, img) {
            var a = $('<a/>').append(img);
            self.$el.append(a);
        });
    },

    insertRows: function() {
        if (this.images.unviewed().length === 0) {
            $('#indicator').remove();
            return;
        }
        for (var i = 0; i < 8; i++) {
            this.insertRow();
        }
        if (this.images.unviewed().length === 0) {
            $('#indicator').remove();
        }
    },

    endlessScroller: function() {
        /* Insert row of images if scroll near bottom of page. */
        if (this.images.unviewed().length === 0) {
            // Don't do anything if all images inserted.
            return;
        }

        var documentHeight = $(document).height();
        var windowHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        var scrollBot = scrollTop + windowHeight;
        if (scrollBot / documentHeight >= 0.5 || scrollTop == documentHeight) {
            this.insertRows();
        }
    },

    initOverlay: function() {
        var overlayBg = $('.overlay-bg');
        // Create overlay background.
        overlayBg.click(function() {
            window.location.hash = null;
            $('.overlay').hide();
            $('.overlay-img.full').hide();
            $('.overlay-img.thumb').show();
            $('body').unbind('keyup');
        });
    },

    showImage: function(event) {
        /* Overlay full size image when clicked. */
        var image = this;
        var self = event.data.view;
        $('.overlay').show();
        window.location.hash = this.id;

        // Create full size image.
        var imgThumb = $('.overlay-img.thumb');
        var imgLarge = $('.overlay-img.full');
        var imgGroup = $('.overlay-img');

        // Scale down to viewport size if necessary.
        var d = calcScaledSize(this);
        imgGroup.css('width', d[0]);
        imgGroup.css('height', d[1]);
        imgThumb.attr('src', image.get('thumbSrc'));
        imgLarge.attr('src', image.get('src') || image.get('thumbSrc'));

        // Switch to prev/next image on click.
        // Hide the overlay images, prepare to view the next one.
        imgGroup.add('.overlay .nav').off('click');
        var showPrevImage = function() {
            imgGroup.hide().attr('src', '');
            self.showImage.apply(self.images.prev(image), [event]);
        };
        var showNextImage = function() {
            imgGroup.hide().attr('src', '');
            self.showImage.apply(self.images.next(image), [event]);
        };
        $('.nav.prev').click(showPrevImage);
        $('.nav.next').add(imgGroup).click(showNextImage);
        $('body').keyup(function(e) {
            if ([32, 37].indexOf(e.keyCode || e.which) !== -1)
                showPrevImage();
            if ((e.keyCode || e.which) == 39)
                showNextImage();
        });

        // Center image based on its width/height and viewport size once loaded.
        imgLarge.on('load', function() {
            imgThumb.hide();
            $(this).show();
        });
        imgThumb.on('load', function() {
            $(this).show();
        });

        // Return the corresponding model of the image.
        return image;
    },
});

var albumView = new AlbumView();

})(jQuery);
