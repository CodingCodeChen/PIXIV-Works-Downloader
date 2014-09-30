$(document).ready(function() {

    //function sets

    setIconUrl = function() {

        var enlargeIconUrl = chrome.extension.getURL("image/enlarge.png");
        var crossIconUrl = chrome.extension.getURL("image/cross.png");
        var loadingIconUrl = chrome.extension.getURL("image/loading.gif");
        var downloadIconUrl = chrome.extension.getURL("image/download.png");
        var multiDownloadIconUrl = chrome.extension.getURL("image/multiDownload.png");
        var upIconUrl = chrome.extension.getURL("image/arrows/up.png");
        var downIconUrl = chrome.extension.getURL("image/arrows/down.png");
        var leftIconUrl = chrome.extension.getURL("image/arrows/left.png");
        var rightIconUrl = chrome.extension.getURL("image/arrows/right.png");

        return {
            enlarge : enlargeIconUrl,
            cross : crossIconUrl,
            loading : loadingIconUrl,
            download : downloadIconUrl,
            multiDownload : multiDownloadIconUrl,
            up : upIconUrl,
            down : downIconUrl,
            left : leftIconUrl,
            right : rightIconUrl
        };
    }; //end setIconUrl

    setBox = function(IconUrl) {
        $('body').append(
            $('<div>', {
                id : "box"
            }).append(
                $('<img>', {
                    title : "Close",
                    id : "boxClose",
                    class : "icon overlay boxController",
                    src : IconUrl.cross
                })
            ).append(
                $('<a>', {
                    id : "boxDownloadLink"
                }).append(
                    $('<img>', {
                        title : "Download",
                        id : "boxDownload",
                        class : "icon overlay boxController",
                        src : IconUrl.download
                    }))
            ).append(
                $('<img>', {
                    id : "boxMultiDownload",
                    class : "icon overlay boxController",
                    src : IconUrl.multiDownload
                })
            ).append(
                $('<img>', {
                    id : "boxLoading",
                    class : "icon",
                    src : IconUrl.loading
                })
            ).append(
                $('<div>', {
                    id : "boxTitle"
                })
            ).append(
                $('<div>', {
                    id : "boxLeft",
                    class : "boxController" 
                }).append(
                    $('<img>', {
                        id : "boxLeftIcon",
                        class : "icon overlay",
                        src : IconUrl.left 
                    })
                ) //end div#boxleft append
            ).append(
                $('<div>', {
                    id : "boxRight",
                    class : "boxController"
                }).append(
                    $('<img>', {
                        id : "boxRightIcon",
                        class : "icon overlay",
                        src : IconUrl.right
                    })
                ) //end div#boxleft append
            ).append(
                $('<div>', {
                    id : "boxUp",
                    class : "boxController multiPicture"
                }).append(
                    $('<img>', {
                        id : "boxUpIcon",
                        class : "icon overlay",
                        src : IconUrl.up
                    })
                ) //end div#boxleft append
            ).append(
                $('<div>', {
                    id : "boxDown",
                    class : "boxController multiPicture"
                }).append(
                    $('<img>', {
                        id : "boxDownIcon",
                        class : "icon overlay",
                        src : IconUrl.down
                    })
                ) //end div#boxleft append
            ).append(
                $('<div>', {
                    id : "boxContent"
                })
            ) //end div#box append
        ); //end body append box

        $('body').append(
            $('<div>')
                .attr('id', 'boxShadow')
                .css({
                    'height' : window.innerHeight,
                    'width' : window.innerWidth,
                })
        ); //end body append boxShadow

    }; //end setBox

    initialEnlarge = function($enlarge) {
        $enlarge.css({
            "display" : "none",
            "opacity" : 0.4
        }).unbind();
    }; //end initialEnlarge

    setThumbnail = function() {
         
        var $thumbnails = $("._thumbnail"); //get img._thumbnail (small picture)

        $thumbnails.hover(
            function(event) {
                var $this = $(this); //thumbnail
                var $enlarge = $('#enlarge'); //enlargeIcon
                var offsetOfThumbnail = $this.offset(); //absolute position

                //width() : element
                //outerWidth() : (border + padding)*2 + element
                //outerWidth(true) : (margin + border + padding)*2 + element
                var enlargeTop = offsetOfThumbnail.top;
                var enlargeLeft = offsetOfThumbnail.left + $this.outerWidth() - $enlarge.outerWidth(true);
                $('#enlarge').css({
                    "display" : "inline",
                    "top" : enlargeTop,
                    "left" : enlargeLeft
                });

                setEnlargeEvent($enlarge, $this);
            },
            function() {
                $enlarge = $('#enlarge');
                //if mouse on #enlarge, don't remove #enlarge
                if(!$enlarge.is(":hover")) {
                    initialEnlarge($enlarge);
                }
            }); //end hover
    }; //end setThumbnail

    urlParam = function(url, name) {
        var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(url);
       return results[1] || 0;
    }; //end urlParam

    $.download = function() {
        var $boxImg = $('#boxImg');
        var src = $boxImg.attr("src").replace("c/600x600/img-master/", "img-original/");
        var bigSrc = src.substring(0, src.lastIndexOf("_")) + ".png";

        $('#boxDownloadLink').attr({
            href : bigSrc,
            download : ""
        });
    }; //end $.download

    getDetailByAjax = function(href) {

            //get medien picture by ajax
            $.get(href, function(data) {

                var $boxLoading = $('#boxLoading');
                var $box = $('#box');

                //parse web to get medien source
                var $parsed = $('<div>').append(data);
                var detailHref = $parsed.find('.works_display').children('a').attr('href');
                var mode = urlParam(detailHref, "mode");
                if(mode === "manga") {
                    //$('#boxDownIcon').css({display : "inline"});
                }
                var medienSrc = $parsed.find('.works_display').children('a').children('img').attr('src');
                //end parse web to get medien source

                var bigSrc = medienSrc.replace('_m', ''); //big picture source is medien source remove _m

                var $boxImg = $('#boxImg');
                
                //when #boxImg's src change, change top, left, height and width
                $boxImg.attr('src', medienSrc).load(function() {

                    $this = $(this); //boxImg

                    //get initial picture size
                    var medienPicture = new Image();
                    medienPicture.src = $this.attr("src");
                    //end get initial picture size

                    //We have to get gap of size between thumbnail and medien picture
                    var topOffsetFromBeforeToAfter = (medienPicture.height - $this.height())/2;
                    var leftOffsetFromBeforeToAfter = (medienPicture.width - $this.width())/2;

                    $boxLoading.css({
                        display : "none",
                    }); //boxLoading icon disable

                    //animate box and boxImg
                    $box.animate({
                        top : "-=" + topOffsetFromBeforeToAfter,
                        left : "-=" + leftOffsetFromBeforeToAfter,
                        height : medienPicture.height,
                        width : medienPicture.width
                    }, {
                        step : function(now, fx) {
                           if(fx.prop === "height") {
                               $boxImg.css({
                                    height : now
                               });
                           }
                           if(fx.prop === "width") {
                               $boxImg.css({
                                    width : now
                               });
                           }
                        },
                        complete : function() {
                            $('#boxClose').css({display : "inline"});
                            //$('#boxDownload').css({display : "inline"}).unbind().click($.download);
$('#boxDownload').css({display : "inline"}).unbind();
$.download();
                        }
                    }); //end box animate
                }); //end #boxImg load
            });
            //end get medien picture by ajax

    }; //end getDetailByAjax

    $.boxClose = function(event) {
                var $box = event.data.box;
                var thumbnailWidth= event.data.thumbnailWidth;
                var thumbnailHeight = event.data.thumbnailHeight;
                var initialBoxTop = event.data.initialBoxTop;
                var initialBoxLeft = event.data.initialBoxLeft;
                var $controller = $('.boxController');
                var $boxShadow = $('#boxShadow');
                $controller.css({display : "none"});
                $box.delay(1).animate({
                    'width' : thumbnailWidth,
                    'height' : thumbnailHeight,
                    'top' : initialBoxTop,
                    'left' : initialBoxLeft 
                }, {
                    step : function(now, fx) {
                        if(fx.prop === "width") {
                            $('#boxImg').css({
                                width : now
                            });
                        }
                        if(fx.prop === "height") {
                            $('#boxImg').css({
                                height : now
                            });
                        }
                    },
                    complete : function() {
                        $boxShadow.css("display", "none");
                        $box.css({
                            display : "none",
                            width : "auto",
                            height : "auto"
                        });
                        $('html').css({overflow : "auto"}); //enable scroll bar
                        $('#boxImg').remove();
                    }
                }); //end box animate
    }; //end $.boxClose

    setEnlargeEvent = function($enlarge, $thumbnail) {

        $enlarge.hover(
            function() {
                $(this).css("opacity", 1.0);
            },
            function() {
                initialEnlarge($(this));
            }
        ).click($thumbnail, function(event) {

            var $this = $(this); //enlargeIcon
            var $thumbnail = $(event.data); //thumbnail
            var $box = $('#box'); //box
            var $boxContent = $('#boxContent'); //box content
            var $boxLoading = $('#boxLoading'); //box loading
            var $boxShadow = $('#boxShadow'); //box shadow

            var href = $thumbnail.closest('a').attr('href'); //picture link

            //get thumbnail coordinate, width and height
            var thumbnailTop = $thumbnail.offset().top;
            var thumbnailLeft = $thumbnail.offset().left;
            var thumbnailWidth = $thumbnail.width();
            var thumbnailHeight = $thumbnail.height();
            //end get thumbnail coordinate, width and height

            $('html').css({overflow : "hidden"}); //disable scroll bar

            //set thumbnail for box
            $boxContent
                .append($('<img>', {
                    id : "boxImg",
                    src : $thumbnail.attr('src')
                }).css({
                    'height' : thumbnailHeight,
                    'width' : thumbnailWidth
                }));
            //end set thumbnail for box

            getDetailByAjax(href);

            $('.boxController').css({display : 'none'}); //button display none

            //set box initial value
            var initialBoxLeft = thumbnailLeft - ($box.outerWidth(true) - $box.width())/2 + ($thumbnail.outerWidth() - thumbnailWidth)/2;
            var initialBoxTop = thumbnailTop - ($box.outerHeight(true) - $box.height())/2 + ($thumbnail.outerHeight() - thumbnailHeight)/2;
            $box.css({
                'top' : initialBoxTop,
                'left' : initialBoxLeft,
                'display' : 'inline',
                'position' : 'absolute'
            });
            //end set box initial value

            $('#boxClose').unbind().click({'box' : $box, 'thumbnailWidth' : thumbnailWidth, 'thumbnailHeight' : thumbnailHeight, 'initialBoxTop' : initialBoxTop, 'initialBoxLeft' : initialBoxLeft}, $.boxClose);

            //set boxshadow. When click boxShadow, disable box and boxShadow
            $boxShadow.css({display : "inline"}).unbind()
            .click({'box' : $box, 'thumbnailWidth' : thumbnailWidth, 'thumbnailHeight' : thumbnailHeight, 'initialBoxTop' : initialBoxTop, 'initialBoxLeft' : initialBoxLeft}, $.boxClose); //end boxShadow click

            //set boxLoading initial position
            var initialBoxLoadingLeft = $boxLoading.position().top + ($box.width() - $boxLoading.width())/2;
            var initialBoxLoadingTop = $boxLoading.position().left + ($box.height() - $boxLoading.height())/2;
            $boxLoading.css({display : "inline"})
                .css({
                    top : "50%",
                    left : "50%"
                }).css({
                    top : $boxLoading.position().top - $boxLoading.height()/2,
                    left : $boxLoading.position().left - $boxLoading.width()/2,
                });
            //end set boxLoading initial position

            //move box to centered
            $box.animate({
                top : $(document).scrollTop() + (window.innerHeight - $box.outerHeight(true))/2,
                left : $(document).scrollLeft() + (window.innerWidth - $box.outerWidth(true))/2
            });
            
            initialEnlarge($this);
            event.preventDefault();
        });
    };

    setEnlarge = function(IconUrl) {
        $('body').append(
            $("<img>", {
                src : IconUrl.enlarge,
                class : "overlay icon",
                id : "enlarge",
                title : "Enlarge",
                display : "none"
                })
        );
    }; //end setEnlarge

    //end function sets
    
    var IconUrl = setIconUrl();
    setBox(IconUrl);
    setEnlarge(IconUrl);
    setThumbnail();

    $(window).resize(function() {
        var $boxShadow = $('#boxShadow');
        $boxShadow.css({
            width : window.innerWidth,
            height : window.innerHeight
        });

        var $box = $('#box');
        $box.css({
            top : $(document).scrollTop() + (window.innerHeight - $box.outerHeight(true))/2,
            left : $(document).scrollLeft() + (window.innerWidth - $box.outerWidth(true))/2
        }); //end box animate
    }); //end window resize

    //$(window).scroll(function() {
    //    var $box = $('#box');
    //    $box.css({
    //        top : $(document).scrollTop() + (window.innerHeight - $box.outerHeight(true))/2,
    //        left : $(document).scrollLeft() + (window.innerWidth - $box.outerWidth(true))/2
    //    }); //end box animate
    //}); //end window scroll
});
