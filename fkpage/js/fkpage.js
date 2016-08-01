;
(function($) {
    var fkPage = function(ops) {
        if (!this instanceof fkPage) {
            return new fkPage(ops);
        }
        this.setting = {
                pagecon: "#fk", //最外面的容器
                section: "section", //每一个section页面类名
                slide: "slide", //一个页面的横页面类名
                navigation: true, //导航
                navigationTopics: [], //导航标题
                navigationDirection: "right",
                sectionColor: [], //每一个section页面的背景色
                slideNavigation: true, //横页面导航
                slideNavigationDirection: "bottom",
                slideLoop: false, //横页面循环
                topLoop: false, //首页循环到末页
                bootomLoop: false, //末页循环到首页
                onLoad: null, //滚到该页面后的事件
                onLeave: null //从该页面离开前的事件  
            },
            self = this,
            winW = $(window).width(),
            winH = $(window).height(),
            oleave = false,
            oload = false;
        $.extend(this.setting, ops);
        if (typeof(this.setting.onLeave) === "function") {
            oleave = true;
        }
        if (typeof(this.setting.onLoad) === "function") {
            oload = true;
        }
        var osection = $('.' + this.setting.section);
        var sectionL = osection.length,
            slides = [],
            aslides = [],
            scleft = null,
            scright = null;
        //=====slide=====
        for (var i = 0; i < sectionL; i++) {
            var slideLen = osection.eq(i).find('.' + self.setting.slide).length;
            if (slideLen > 0) {
                slides.push(i);
                aslides.push(slideLen);
            }
        }
        if (slides.length !== 0) {
            for (var i = 0, l = slides.length; i < l; i++) {
                osection.eq(slides[i]).css({
                    width: winW * aslides[i]
                })
            }
            $('.' + self.setting.slide).css({
                width: winW
            })
            for (var i = 0, sl = slides.length; i < sl; i++) {
                $('body').append("<div class='slidesList'data-slideList='" + slides[i] + "'><ul></ul></div><span class='scleft' data-section='" + slides[i] + "'><img src='./image/slideLBG.png'></span><span class='scright' data-section='" + slides[i] + "'><img src='./image/slideRBG.png'></span>");
                var aslideList = osection.eq(slides[i]).find('.' + self.setting.slide),
                    aslideListUl = $('.slidesList ul');
                for (var j = 0, l = aslideList.length; j < l; j++) {
                    aslideListUl.eq(i).append("<li data-section='" + slides[i] + "' data-slide='" + j + "'></li>");
                }
                var liw = aslideListUl.find("li").width() + 10,
                    asl = $('.slidesList').eq(i);
                asl.css({
                    width: aslideList.length * liw,
                    left: (winW - asl.width()) / 2
                })
                $('.slidesList').eq(i).find("ul li").eq(0).addClass('active');
            }
            scleft = $('.scleft'),
            scright = $('.scright');
            if (slides[0] === 0) {
                $('.slidesList').eq(0).css({
                    display: "block"
                })
                scleft.eq(0).css({
                    display: "block"
                })
                scright.eq(0).css({
                    display: "block"
                })
            }
            $('.slidesList ul li').click(function() {
                self.slideLiClick(this, osection, slides);
            })
            if (!self.setting.slideLoop) {
                scleft.addClass("scban");
            }
            if (self.setting.slideNavigationDirection === "top") {
                $(".slidesList").css({
                    top: 10
                })
            } else if (self.setting.slideNavigationDirection !== "bottom" && self.setting.slideNavigationDirection !== "top") {
                alert("横向导航条只能选择上部或者底部哦\n(即只能设置slideNavigationDirection:top)")
            }
            //为方向按钮添加事件
            scleft.click(function() {
                self.slideFunc(this, true, slides, osection);
            })
            scright.click(function() {
                self.slideFunc(this, false, slides, osection);
            })
            if (!self.setting.slideNavigation) {
                for (var i = 0, len = $('.slidesList').length; i < len; i++) {
                    $('.slidesList').eq(i).css({
                        display: "none"
                    })
                }
            } //self.setting.slideNavigation
        } //slides.length
        //navigation
        if (this.setting.navigation) {
            $("<div class='olist'><ul></ul></div>").appendTo($('body'));
            $('.olist').css({
                height: (sectionL) * 25
            })
            if (this.setting.navigationTopics.length > 0) {
                for (var i = 0; i < sectionL; i++) {
                    $("<li data-li-op=" + (i) + "><span class='topics'>" + this.setting.navigationTopics[i] + "</span></li>").appendTo($('.olist ul'));
                }
            } else {
                for (var i = 0; i < sectionL; i++) {
                    $("<li data-li-op=" + (i) + "><span class='topics'>第" + (i + 1) + "页</span></li>").appendTo($('.olist ul'));
                }
            }
            $('.olist ul li').eq(0).addClass('active');
            $('.olist ul li').click(function() {
                self.liClick(this, osection);
            })
            if (self.setting.navigationDirection === "left") {
                $('.olist').css({
                    left: 20
                })
            } else if (self.setting.navigationDirection !== "left" && self.setting.navigationDirection !== "right") {
                alert("导航条只能选择左边或者右边哦\n(即只能设置navigationDirection:left)");
            }
        }
        osection.css({
            height: winH,
            display: "block"
        })
        for (var i = 0; i < sectionL; i++) {
            osection.eq(i).attr({
                "data-op": i + 1,
                zIndex: i + 10000
            })
        }
        if (this.setting.sectionColor.length > 0) {
            for (var i = 0; i < sectionL; i++) {
                osection.eq(i).css({
                    "background-color": self.setting.sectionColor[i]
                });
            }
        }
        $(window).resize(function() {
            self.throttle(resizeEle, window);
        })

        function resizeEle() {
            console.log(456);
            winW = $(window).width();
            winH = $(window).height();
            osection.css({
                height: winH,
            })
            if (self.setting.slideNavigation) {
                var sl = $('.slidesList');
                for (var i = 0, len = sl.length; i < len; i++) {
                    sl.eq(i).css({
                            left: (winW - sl.eq(i).width()) / 2
                        })
                        //console.log((winW - sl.eq(i).width()) / 2);
                }
            }
            for (var i = 0, l = slides.length; i < l; i++) {
                osection.eq(slides[i]).css({
                    width: winW * aslides[i]
                })
            }
            $('.' + self.setting.slide).css({
                width: winW
            })
        }
        if (self.isPC()) {
            var e = window.event || e;
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', function() {
                    self.scrollFunc(e, true, 0)
                }, false);
            }
            document.onmousewheel = function() {
                self.scrollFunc(e, true, 0); //IE/Opera/Chrome
            }
        } else {
            var e = window.event || e,
                oy = 0,
                ox = 0,
                omovey = 0,
                omovex = 0,
                ismove = false,
                atarget = null;
            document.addEventListener("touchstart", function(e) {
                oy = 0, ox = 0;
                var otarget = e.targetTouches[0];
                atarget = otarget.target,
                    hasSlides = false,
                    aslideNum = null,
                    targetSectionOp = self.findP($(atarget), "section").attr("data-op") - 1;
                for (var i = 0, l = slides.length; i < l; i++) {
                    if (targetSectionOp == slides[i]) {
                        hasSlides = true;
                        aslideNum = i;
                    }
                }
                console.log(targetSectionOp + "----------");
                //console.log($(atarget))
                oy = -otarget.screenY; //从上到下是负数所以-
                ox = -otarget.screenX; //从上到下是负数所以-
            }, false);
            document.addEventListener("touchmove", function(e) {
                e.preventDefault();
                omovey = 0;
                var otarget = e.targetTouches[0];
                omovey = otarget.screenY;
                omovex = otarget.screenX;
                ismove = true;
            }, false);
            document.addEventListener("touchend", function(e) {
                //console.log(omovey + "bbmovey");
                //console.log(-oy + "aaoy");
                if (ismove) {
                    var movex = omovex + ox,
                        movey = omovey + oy;
                    console.log(movex + "||" + movey);
                    if (Math.abs(movex) > Math.abs(movey)) {
                        if (hasSlides) {
                            e.preventDefault();
                            if (movex > 50) { //向左滑动，前进到下一个slide<--
                                self.touchSlide(targetSectionOp, false, osection, aslideNum);
                            } else if (movex < -50) { //向右滑动，前进到上一个slide-->
                                self.touchSlide(targetSectionOp, true, osection, aslideNum);
                            }
                        }
                    } else {
                        if (movey > 50) { //判定手势向下
                            console.log(movey + "a");
                            self.scrollFunc(e, false, 1); //手势向下，按照习惯向上滑
                        } else if (movey < -50) { //判定手势向上
                            console.log(movey + "b");
                            self.scrollFunc(e, false, -1); //手势向上，按照习惯向下滑
                        } else if (!movey) {
                            return;
                        }
                    }
                    //console.log(movex + "movex" + movey + "movey");
                    //console.log(omovey +"//"+ (-oy));
                    ismove = false;
                }
            }, false);
        }
    };
    fkPage.prototype = {
        touchSlide: function(_index, direction, osection, aslidenum) {
            var asl = $(".slidesList").eq(aslidenum),
                oactive = parseInt(asl.find('ul .active').attr("data-slide")),
                alists = asl.find("li").length,
                isSlideLoop = self.setting.slideLoop,
                moveDistance = null;
            console.log(alists);
            if (direction) { //前进
                if (oactive < alists - 1) {
                    asl.find(".active").removeClass('active');
                    asl.find("li").eq(oactive + 1).addClass('active');
                    moveDistance = -winW * (oactive + 1);
                    if (oactive == alists - 2) {
                        if (!isSlideLoop) {
                            $('.scright').eq(aslidenum).addClass("scban");
                        }
                    }
                    $('.scleft').eq(aslidenum).removeClass("scban");
                } else {
                    if (isSlideLoop) {
                        asl.find(".active").removeClass('active');
                        asl.find("li").eq(0).addClass('active');
                        moveDistance = 0;
                        $('.scright').eq(aslidenum).removeClass("scban");
                    }
                }
            } else { //后退
                if (oactive > 0) {
                    asl.find(".active").removeClass('active');
                    asl.find("li").eq(oactive - 1).addClass('active');
                    moveDistance = -winW * (oactive - 1);
                    if (oactive == 1) {
                        if (!isSlideLoop) {
                            $('.scleft').eq(aslidenum).addClass("scban");
                        }
                    }
                    $('.scright').eq(aslidenum).removeClass("scban");
                } else {
                    if (isSlideLoop) {
                        asl.find(".active").removeClass('active');
                        asl.find("li").eq(alists - 1).addClass('active');
                        moveDistance = -winW * (alists - 1);
                        $('.scleft').eq(aslidenum).removeClass("scban");
                    }
                }
            }
            osection.eq(_index).css({
                transform: "translateX(" + moveDistance + "px)"
            })
            console.log(moveDistance + "||" + oactive + "||" + aslidenum + "||" + self.setting.slideLoop);
        },
        //左右按钮移动函数
        slideFunc: function(_this, direction, slides, oparent) {
            var iSection = $(_this).attr("data-section"),
                isLoop = self.setting.slideLoop;
            for (var i = 0; i < slides.length; i++) {
                if (slides[i] == iSection) {
                    var SL = $('.slidesList').eq(i),
                        slActive = SL.find('ul .active').attr("data-slide"),
                        slideSum = SL.find("li").length - 1,
                        dir = 0;
                    if (slActive != 0 && slActive != slideSum) {
                        if (direction) {
                            dir = parseInt(slActive) - 1;
                        } else if (!direction) {
                            dir = parseInt(slActive) + 1;
                        }
                        oparent.eq(slides[i]).css({
                            transform: "translateX(" + (-winW * dir) + "px)"
                        })
                        SL.find("ul li").removeClass("active");
                        SL.find("ul li").eq(dir).addClass("active");
                        $('.scleft').eq(i).removeClass("scban");
                        $('.scright').eq(i).removeClass("scban");
                        if (!isLoop) {
                            if (dir == 0) {
                                $('.scleft').eq(i).addClass("scban");
                            } else if (dir == slideSum) {
                                $('.scright').eq(i).addClass("scban");
                            }
                        }
                    } else if (slActive == 0) {
                        if (direction) {
                            if (isLoop) {
                                oparent.eq(slides[i]).css({
                                    transform: "translateX(" + (-winW * (slideSum - slActive)) + "px)"
                                })
                                SL.find("ul li").removeClass("active");
                                SL.find("ul li").eq(slideSum - slActive).addClass("active");
                            }
                        } else {
                            oparent.eq(slides[i]).css({
                                transform: "translateX(" + (-winW) + "px)"
                            })
                            SL.find("ul li").removeClass("active");
                            SL.find("ul li").eq(1).addClass("active");
                            console.log($('.scleft').hasClass("scban"));
                            if (!isLoop) {
                                $('.scleft').eq(i).removeClass('scban');
                            }
                        }
                        console.log(slActive + "--" + direction + "--" + $('.scleft').eq(i).attr("class") + "--" + !self.setting.slideLoop);
                    } else if (slActive == slideSum) {
                        if (!direction) {
                            if (isLoop) {
                                oparent.eq(slides[i]).css({
                                    transform: "translateX(0px)"
                                })
                                SL.find("ul li").removeClass("active");
                                SL.find("ul li").eq(0).addClass("active");
                            }
                            console.log(1);
                        } else {
                            oparent.eq(slides[i]).css({
                                transform: "translateX(" + -winW * (slideSum - 1) + "px)"
                            })
                            SL.find("ul li").removeClass("active");
                            SL.find("ul li").eq(slideSum - 1).addClass("active");
                            if (!isLoop) {
                                $('.scright').eq(i).removeClass('scban');
                            }
                        }
                    }
                    console.log(slActive + "^^" + dir + "--" + (slActive == slideSum) + "--" + i);
                }
            }
        },
        //slide按钮点击函数
        slideLiClick: function(_this, oparent, slides) {
            //alert(1);
            var thisSlide = $(_this),
                sectionSlide = thisSlide.attr('data-section'),
                slideOP = thisSlide.attr('data-slide');
            thisSlide.parent().find("li").removeClass("active");
            thisSlide.addClass('active');
            for (var i = 0, l = slides.length; i < l; i++) {
                if (slides[i] == sectionSlide) {
                    oparent.eq(sectionSlide).css({
                        transform: "translateX(" + (-winW * slideOP) + "px)"
                    })
                    if (!self.setting.slideLoop) {
                        var scleft = $('.scleft').eq(i),
                            scright = $('.scright').eq(i),
                            liLength = $('.slidesList').eq(i).find("li").length - 1;
                        console.log(liLength);
                        if (slideOP != 0 && slideOP != liLength) {
                            scleft.removeClass("scban");
                            scright.removeClass("scban");
                        } else if (slideOP == 0) {
                            scleft.addClass("scban");
                            scright.removeClass("scban");
                        } else if (slideOP == liLength) {
                            scleft.removeClass("scban");
                            scright.addClass("scban");
                        }
                    }
                }
            }
            console.log(sectionSlide + "///" + slideOP + "///" + winW * slideOP);
        },
        //navigation点击函数
        liClick: function(_this) {
            var //_this = _this,
                tarPage = $(_this).attr("data-li-op");
            console.log(tarPage);
            $('.olist ul li').removeClass("active");
            $(_this).addClass("active");
            $('#' + self.setting.pagecon).css({
                transform: "translateY(" + (-winH * tarPage) + "px)"
            })
            if (self.setting.slideNavigation) {
                var aslideList = $('.slidesList');
                for (var i = 0; i < aslideList.length; i++) {
                    if (aslideList.eq(i).find("ul li").attr("data-section") != tarPage) {
                        aslideList.eq(i).css({
                            display: "none"
                        })
                        $('.scleft').eq(i).css({
                            display: "none"
                        })
                        $('.scright').eq(i).css({
                            display: "none"
                        })
                    } else {
                        var _i = i;
                        setTimeout(function() {
                            aslideList.eq(_i).css({
                                display: "block"
                            })
                            $('.scleft').eq(_i).css({
                                display: "block"
                            })
                            $('.scright').eq(_i).css({
                                display: "block"
                            })
                        }, 400)
                    };
                }
            } else {
                var aslideList = $('.slidesList');
                for (var i = 0; i < aslideList.length; i++) {
                    if (aslideList.eq(i).find("ul li").attr("data-section") != tarPage) {
                        $('.scleft').eq(i).css({
                            display: "none"
                        })
                        $('.scright').eq(i).css({
                            display: "none"
                        })
                    } else {
                        var _i = i;
                        setTimeout(function() {
                            $('.scleft').eq(_i).css({
                                display: "block"
                            })
                            $('.scright').eq(_i).css({
                                display: "block"
                            })
                        }, 400)
                    };
                }
            }
        },
        //滚动函数
        scrollFunc: function(e, ispc, otval) {
            var e = e || event,
                tval = otval,
                sectionL = $('.' + self.setting.section).length;
            var dataop = e.srcElement || e.target;
            dataop = $(dataop);
            dataop = self.findP(dataop, self.setting.section),
                sectionOP = dataop.attr("data-op"),
                moveTarget = $("#" + self.setting.pagecon),
                olistLi = $('.olist ul li');
            if (self.isPC()) {
                if (e.wheelDelta) { //IE/Opera/Chrome
                    if (e.wheelDelta > 0) {
                        tval = 1; //向上
                    } else {
                        tval = -1; //向下
                    }
                } else if (e.detail) { //Firefox
                    if (e.detail > 0) {
                        tval = -1; //向下
                    } else {
                        tval = 1; //向上
                    }
                }
            }
            var nextPage = 0;
            if (oleave) {
                self.setting.onLeave(sectionOP);
            }
            //为sectionNavigation添加类active
            olistLi.removeClass("active");
            if (parseInt(sectionOP) - tval <= sectionL - 1) {
                if (parseInt(sectionOP) - tval - 1 >= 0) {
                    olistLi.eq(parseInt(sectionOP) - tval - 1).addClass("active");
                } else if (parseInt(sectionOP) - tval - 1 < 0) {
                    olistLi.eq(0).addClass("active");
                }
            } else if (parseInt(sectionOP) - tval > sectionL - 1) {
                olistLi.eq(sectionL - 1).addClass("active");
            }
            moveTarget.addClass('willChange');
            //判断滚动状态
            if (sectionOP > 1 && sectionOP < sectionL) {
                if (tval === -1) {
                    console.log(sectionOP + "21");
                    moveTarget.css({
                            transform: "translateY(" + winH * tval * sectionOP + "px)"
                        }) //如果向下翻页
                    nextPage = parseInt(sectionOP) + 1;
                } else if (tval === 1) {
                    moveTarget.css({
                            transform: "translateY(" + (-winH * (sectionOP - 2)) + "px)" //因为sectionOP是以1开头的，但是translate是以0开头，所以-2
                        }) //如果向上翻页
                    nextPage = sectionOP - 1;
                }
                if (oload) {
                    self.setting.onLoad(parseInt(sectionOP) - tval);
                }
            } else if (sectionOP == 1) {
                if (tval === 1) {
                    if (!self.setting.topLoop) {
                        nextPage = 1;
                        return;
                    } else {
                        moveTarget.css({
                                transform: "translateY(" + (-winH * (sectionL - 1)) + "px)"
                            }) //如果允许topLoop,则向下翻到最后一页
                        olistLi.removeClass("active");
                        olistLi.eq(sectionL - 1).addClass("active");
                        if (oload) {
                            self.setting.onLoad(sectionL);
                        }
                        nextPage = sectionL;
                    }
                } else if (tval === -1) {
                    //console.log(sectionOP + "12");
                    moveTarget.css({
                            transform: "translateY(" + winH * tval + "px)"
                        }) //向下翻页
                    nextPage = parseInt(sectionOP) - tval;
                    if (oload) {
                        self.setting.onLoad(parseInt(sectionOP) - tval);
                    }
                }
            } else if (sectionOP == sectionL) {
                if (tval === -1) {
                    if (!self.setting.bottomLoop) {
                        nextPage = sectionOP;
                        return;
                    } else {
                        moveTarget.css({
                                transform: "translateY(" + (0) + "px)"
                            }) //如果允许bottomLoop,则向上翻到第一页
                        olistLi.removeClass("active");
                        olistLi.eq(0).addClass("active");
                        nextPage = 1;
                    }
                    if (oload) {
                        self.setting.onLoad(1);
                    }
                } else {
                    moveTarget.css({
                            transform: "translateY(" + (-winH * (sectionOP - 2)) + "px)"
                        }) //向上翻页
                    nextPage = sectionOP - 1;
                    if (oload) {
                        self.setting.onLoad(parseInt(sectionOP) - tval);
                    }
                }
            }
            moveTarget.removeClass('willChange');
            //console.log(nextPage - 1);
            var oslides = $('.slidesList'),
                slul = oslides.length;
            if (slul > 0) {
                if (self.setting.slideNavigation) {
                    for (var i = 0; i < slul; i++) {
                        if (oslides.eq(i).find("ul li").attr("data-section") != (nextPage - 1)) {
                            oslides.eq(i).css({
                                display: "none"
                            })
                            $('.scleft').eq(i).css({
                                display: "none"
                            })
                            $('.scright').eq(i).css({
                                display: "none"
                            })
                        } else {
                            var _i = i;
                            setTimeout(function() {
                                oslides.eq(_i).css({
                                    display: "block"
                                })
                                $('.scleft').eq(_i).css({
                                    display: "block"
                                })
                                $('.scright').eq(_i).css({
                                    display: "block"
                                })
                            }, 400)
                        };
                    }
                } else {
                    for (var i = 0; i < slul; i++) {
                        if (oslides.eq(i).find("ul li").attr("data-section") != (nextPage - 1)) {
                            $('.scleft').eq(i).css({
                                display: "none"
                            })
                            $('.scright').eq(i).css({
                                display: "none"
                            })
                        } else {
                            var _i = i;
                            setTimeout(function() {
                                $('.scleft').eq(_i).css({
                                    display: "block"
                                })
                                $('.scright').eq(_i).css({
                                    display: "block"
                                })
                            }, 400)
                        };
                    }
                }
            }
        },
        //节流函数
        throttle: function(method, context) {
            clearTimeout(method.tid);
            method.tid = setTimeout(function() {
                method.call(context);
            }, 500);
        },
        //找根函数
        findP: function(anode, nclass) {
            if (anode.hasClass(nclass)) {
                return anode;
            } else if (anode.parent().hasClass(nclass)) {
                return anode.parent();
            } else {
                var ps = anode.parentsUntil($('body'), "." + nclass);
                return ps;
            }
        },
        //浏览器判别
        isPC: function() {
            if (navigator.userAgent.match(/(iphone|ipad|Android|ios|window Phone)/i)) {
                return false;
            } else {
                return true;
            }
        }
    };
    window['fkPage'] = fkPage;
})(jQuery);
/*
                <div class="navbar navbar-inverse" role="navigation">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navitem">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        </button>
                        <a href="#" class="navbar-brand" >
                        flovek.cn
                        </a>
                    </div>
                    <div class="collapse navbar-collapse pull-right" id="navitem">
                        <ul class="nav navbar-nav" >
                            <li><a href="##">
                                首页
                            </a></li>
                            <li><a href="##">
                                博客
                            </a></li>
                            <li><a href="##">
                                杂文
                            </a></li>
                            <li><a href="##">
                                插件
                            </a></li>
                        </ul>
                    </div>
                </div>
                <div class="imgcon">
                    <div class="img-con">
                        <img src="image/img01.jpg" alt="远航在碧蓝的大海中" >
                        <div class="imgmask">
                            <div class="imgtext">远航在碧蓝的大海中</div>
                        </div>
                    </div>
                    <div class="img-con">
                        <img src="image/img02.jpg" alt="宁静黄昏" />
                        <div class="imgmask">
                            <div class="imgtext">宁静黄昏</div>
                        </div>
                    </div>
                    <div class="img-con">
                        <img src="image/img03.jpg" alt="书" />
                        <div class="imgmask">
                            <div class="imgtext">想你</div>
                        </div>
                    </div>
                    <div class="img-con">
                        <img src="image/img04.jpg" alt="多拉A梦" />
                        <div class="imgmask">
                            <div class="imgtext">多拉A梦</div>
                        </div>
                    </div>
                </div>


 */