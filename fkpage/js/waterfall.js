;
(function($) {
    var waterFall = function() {
        var self = this;
        self.pdata($('.waterfall'));
        window.onscroll = function() {
            if ($('body').scrollTop() + $(window).height() >= $(document).height() - $('.wf-area').eq($('.wf-area').length - 1).height() / 2) {
                console.log($(window).width());
                self.pdata($('.waterfall'));
            };
        };
    };
    waterFall.prototype = {
        ajaxP: function() {},
        minh: function(arr) {
            var mh = Math.min.apply(null, arr);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == mh) {
                    return i;
                }
            }
        },
        waterF: function(data, parent) {
            var self = this,
                ph = [],
                lnum = Math.floor(parent.innerWidth() / ($('.wf-area').eq(0).width())),
                ml = Math.min(Math.floor((parent.innerWidth() - $('.wf-area').eq(0).width() * lnum) / lnum),10);
            for (var i = 0; i < lnum; i++) {
                $('.wf-area').eq(i).css({
                    left: ($('.wf-area').width() + ml) * i,
                    top: 15,
                });
                ph.push($('.wf-area').eq(i).height());
            }
            for (var i = lnum; i < $('.wf-area').length; i++) {
                var imh = self.minh(ph);
                $('.wf-area').eq(i).css({
                    left: ($('.wf-area').width() + ml) * imh,
                    top: ph[imh] + 25,
                });
                ph[imh] += $('.wf-area').eq(i).height() + 15;
            };
        },
        init: function(data, parent) {
            var self = this;
            for (var i = 0; i < data.length; i++) {
                $("<div class='wf-area'><div class='wf-pic'><img src='" + data[i] + "'></div><div class='wf-bottom'></div></div>").appendTo(parent);
            }
            self.waterF(data, parent);
            window.onresize = function() {
                self.waterF(data, parent);
            }
        },
        pdata: function(parent) {
            var self = this,
                odata = ['image/img04.jpg', 'image/img05.jpg', 'image/img06.jpg','image/img07.jpg', 'image/img08.jpg', 'image/img09.jpg', 'image/img10.jpg', 'image/img11.jpg'];
            for (var i = 0; i < odata.length; i++) {
                var image = new Image();
                image.src = odata[i];
                if (i == odata.length - 1) {
                    image.onload = function() {
                        self.init(odata, parent);
                    }
                }
            }
        }
    };
    window['waterFall'] = waterFall;
})(jQuery);