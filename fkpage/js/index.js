var fkPage = new fkPage({ 
    pagecon: "fk",
    section: "section",
    //navigation: false,
    //navigationTopics: ['首页', '博客', '杂文', '插件','a','b'],
    //slideNavigation:false,
    //navigationDirection:"left",
    //slideNavigationDirection:"top",
    topLoop: true,
    bottomLoop: true,
    slideLoop:true,
    onLeave: function(index) {
        if (index == 1) {
            $('.imgcon').animate({
                opacity: 0.5
            })
        }
        if (index == 3) {
            $('.imgshowTtext').animate({
                top: 20
            })
        }
    },
    onLoad: function(index) {
        //alert(index);
        if (index == 1) {
            $('.imgcon').delay(500).animate({
                opacity: 1
            })
        }
        if (index == 3) {
            $('.imgshowTtext').animate({
                top: 100
            },600)
        }
    }
})
var waterFall = new waterFall();
$(".navbar-toggle").click(function() {
    if (!$('#navitem').hasClass("in")) {
        $('#navitem').removeClass("pull-right");
    } else {
        setTimeout(function() {
            $('#navitem').addClass("pull-right");
        }, 300);
    }
})
$(window).resize(function() {
    if ($('#navitem').hasClass("in")) {
        $('#navitem').toggleClass("pull-right");
    }
})