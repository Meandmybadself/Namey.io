<?php
    //Get them over to the app if we can see they've already started.
    if(isset($_COOKIE['hasStarted'])) {
        header('Location:/app/', TRUE, 302);
    }
?>
<!DOCTYPE html>
<!--[if lt IE 7]><html class="ie ie6" lang="en"><![endif]-->
<!--[if IE 7]><html class="ie ie7" lang="en"><![endif]-->
<!--[if IE 8]><html class="ie ie8" lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html lang="en"><!--<![endif]-->
  <head>

    <title>namey.</title>

    <!-- Base meta //-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="description" content="Find a baby name with a swipe of the thumb." />
    <meta name="keywords" content="Baby names" />

    <!-- social medias //-->
    <!-- fb -->
    <meta property="og:url" content="http://namey.io/desktop.html" />
    <meta property="og:title" content="namey."/>
    <meta property="og:description" content="Find a baby name with a swipe of the thumb."/>
    <meta property="og:image" content="http://namey.io/images/fb-image.jpg" />

    <!-- twitter -->
    <meta name="twitter:card" value="summary" />
    <meta name="twitter:site" value="namey." />
    <meta name="twitter:url" content="https://namey.io/desktop.html" />
    <meta name="twitter:title" content="namey." />
    <meta name="twitter:description" content="Find a baby name with a swipe of the thumb." />
    <meta name="twitter:image" content="https://namey.io/images/fb-image.jpg" />

    <!-- mobile //-->
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta http-equiv="x-rim-auto-match" content="none" />

    <!-- css //-->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="//cloud.typography.com/6984932/641468/css/fonts.css" />
    <link href="styles/desktop.css" media="screen, print" rel="stylesheet" type="text/css"  />


    <link rel="icon" type="image/x-icon" href="favicon.ico">
  </head>
<body>
    <div class='container-fluid'>
        <div class='row'>
            <div class='col-xs-offset-1 col-xs-10 col-lg-8 col-lg-offset-2 text-center'>
                <h1>namey.</h1>
                <p>Find a baby name with a flick of your thumb.</p>
                <hr/>
                <div class='row'>
                    <div class='col-xs-12 col-md-4 col1'>
                        <dl>
                            <dd>1.</dd>
                            <dt>Visit this webpage on your phone &amp;<br/> enter your co-parent's email.</dt>
                            <dd class='phone'>
                                <div class='email'>mom2b@namey.io</div>
                                <img src='images/01.jpg' alt='visit this webpage.'/>
                            </dd>
                        </dl>
                    </div>

                    <div class='col-xs-12 col-md-4 col2'>
                        <dl>
                            <dd>2.</dd>
                            <dt>Swipe left if you don't like the name.<br/>Swipe right if you lurve it.<br/></dt>
                            <dd class='phone'>
                                <div class='color green'></div>
                                <div class='color red'></div>
                                <div id='swipe-name' class='name'>
                                    <span>Jeffery</span>
                                </div>
                                <img src='images/02.jpg' alt='like/dislike.'/>
                            </dd>
                        </dl>
                    </div>
                    <div class='col-xs-12 col-md-4 col3'>
                        <dl>
                            <dd>3.</dd>
                            <dt>When you both swipe right on the same name, you'll receive a notification!<br/>Click on the notification to see the name.</dt>
                            <dd class='phone'>
                                <div class='name'>Ashley</div>
                                <img class='matches' src='images/matches.jpg' alt='1 match' />
                                <img src='images/02.jpg' alt='notification!'/>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class='row cta'>
                    <hr/>
                    <div class='col-xs-12 text-center'>
                        <a href='/app/' class='btn btn-success btn-lg'>Check it Out</a>
                    </div>
                </div>
                <hr/>
                <div class='row footer'>
                    <div class='col-xs-12'>
                        Made with Love, in Minnesota,<br/>by <a href='http://permanentrecord.io'>Permanent Record</a>&nbsp;|&nbsp;<a href='mailto:jeffery@permanentrecord.io'>contact</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript" src="//code.jquery.com/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.17.0/TweenMax.min.js"></script>
    <script type="text/javascript" src="scripts/SplitText.min.js"></script>
    <script type="text/javascript" src="scripts/ScrollToPlugin.min.js"></script>
    <script type="text/javascript">
        var split = new SplitText('.email');

        function doAnimation() {

            var color = '#FF0000';

            var tl = new TimelineMax();
            if (window.innerWidth < 1000) {
                tl.to($(window), .8, {scrollTo:{y:0}});
            }
            tl.to($('.col1 dt'), .5, {css:{'color':color}, delay:1})
            tl.to($('.email'), .3, {css:{'borderColor':'#83AAF6'}});
            tl.staggerFrom(split.chars, .2, {opacity:0},.1);
            tl.to($('.col1 dt'), .5, {css:{'color':'#000'}})
            if (window.innerWidth < 1000) {
                var y = $('.col2').offset().top;
                tl.to($(window), .8, {scrollTo:{y:y}});
            }
            tl.to($('.col2 dt'), .5, {css:{'color':color}, delay:.5})
            tl.to($('#swipe-name span'), .5, {css:{'marginLeft':'-300px'}, onComplete:function() { $('#swipe-name span').text("Matthew")}});
            tl.to($('.color.red'), .3, {opacity:.3}, "-=.5");
            tl.to($('.color.red'), .3, {opacity:0});
            tl.set($('#swipe-name span'), {css:{'marginLeft':'300px'}});
            tl.to($('#swipe-name span'), .5, {css:{'marginLeft':'0px'}});
            tl.to($('#swipe-name span'), .5, {css:{'marginLeft':'300px'}, delay:2});
            tl.to($('.color.green'), .3, {opacity:.3}, "-=.5");
            tl.to($('.color.green'), .3, {opacity:0});
            tl.set($('#swipe-name span'), {css:{'marginLeft':'-300px'}, onComplete:function() { $('#swipe-name span').text("Daniel")}});
            tl.to($('#swipe-name span'), .5, {css:{'marginLeft':'0px'}});
            tl.to($('.col2 dt'), .5, {css:{'color':'#000'}});
            if (window.innerWidth < 1000) {
                var y = $('.col3').offset().top;
                tl.to($(window), .8, {scrollTo:{y:y}});
            }
            tl.to($('.col3 dt'), .5, {css:{'color':color}, delay:.5});
            tl.to($('.matches'), .5, {opacity:1});
            if (window.innerWidth < 1000) {
                var y = $('.cta').offset().top;
                tl.to($(window), .8, {scrollTo:{y:y}, delay:2});
            }

        }

        $(function() {
            doAnimation();
        });
    </script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-56010514-4', 'auto');
      ga('send', 'pageview');

    </script>

</body>
</html>