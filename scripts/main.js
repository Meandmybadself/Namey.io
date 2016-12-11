function createUser(email, gender) {
    console.log('createUser', email,gender);
    $('#createUser').addClass('disabled');
    //create a uid.
    var h   = new Hashids("Cock. Balls. http://www.imdb.com/title/tt0302886/");
    var int = Math.floor(Math.random() * 1000000);
    //uid-email-gender-user
    var uid = h.encode(int) + '-' + email + '-' + gender + '-0';
    window.uid = uid;
    //send an email to the co-parent.
    $.post("/create/",
        {'uid':uid, 'email':$('#email').val()},
        onUserCreated,
        "json"
        ).error(onError);
}

function onError() {
    alert("Something's broken.");
    $('#createUser').removeClass('disabled');
   // alert('duh...');
}

function onUserCreated() {
    setUser(window.uid);

}


function onTap(e) {
    if (window.currentSectionId != 'name') {
        return;
    }
    if (e.srcEvent.target.className == "value") {
        //this is a circle-click.
        return;
    }
    var x = e.pointers[0].pageX;
    var swh = window.innerWidth / 2;
    if (x > -1 && x < swh) {
        swipeLeft();
    } else {
        swipeRight();
    }
}

function popName() {
    //Get.
    var names = $.parseJSON(localStorage.getItem(window.uid));
    //Modify.
    names.shift();
    //Persist.
    localStorage.setItem(window.uid,JSON.stringify(names));
}

function swipeLeft(e) {
    if (window.currentSectionId != 'name') {
        return;
    }

    //console.log('swipeLeft ', e);

    var t1   = .3;
    offset   = 150 * t1;

    if (e && e.velocityX) {
        offset = (e.velocityX * 150 * t1);
    }

    x = "-=" + offset + "px";

    TweenMax.to($('#name'), t1, {x:x, opacity:0, ease:Quad.easeOut, onComplete:onNameGoneLeft});
    TweenMax.to($('body'), t1, {css:{'backgroundColor':'#febbbe'}});

}

var offset;

function swipeRight(e) {
    if (window.currentSectionId != 'name') {
        return;
    }

    if (isLocked) {
        return;
    }
    isLocked = true;

    $.post("/vote/",
        {'uid':window.uid, 'name':window.currentName},
        updateCount,
        "json"
    ).error(onError);

    addMatchingName(window.currentName);

    var t1   = .3;
    offset   = 150 * t1;

    if (e && e.velocityX) {
        offset = (e.velocityX * 150 * t1);
    }

    x = "-=" + offset + "px";

    TweenMax.to($('#name'), t1, {x:x, opacity:0, ease:Quad.easeOut, onComplete:onNameGoneRight});
    TweenMax.to($('body'), t1, {css:{'backgroundColor':'#d1efd2'}})
}
function onNameGoneRight() {
    popName();
    showNextName();
    var t2 = .3;
    var d = .2;
    TweenMax.set($('#name'), {x:"+=" + offset + "px"});
    TweenMax.to($('body'), t2, {css:{'backgroundColor':'#FFFFFF', delay:d}});
    TweenMax.to($('#name'), t2, {opacity:1, ease:Quad.easeOut, onComplete:onNameShown, delay:d});


}

function onNameGoneLeft() {
    popName();
    showNextName();
    var t2 = .3;
    var d = .2;
    TweenMax.set($('#name'), {x:"+=" + offset + "px"});
    TweenMax.to($('body'), t2, {css:{'backgroundColor':'#FFFFFF', delay:d}});
    TweenMax.to($('#name'), t2, {opacity:1, ease:Quad.easeOut, onComplete:onNameShown, delay:d});


}

function onNameShown() {
    isLocked = false;
}

function showMatches() {
    $.post('/vote/',
        {'uid':window.uid,'list':1},
        onMatchesLoaded,
        "json").error(onError);
}

function onMatchesLoaded(data) {
    $('#matches').empty();
    for(var i=0; i < data.length; i++) {
        var li = $('<li>'+data[i]+'</li>');
        $('#matches').append(li);
    }
    showSection('matchesList');
    $('#close-matches').on(ch, onCloseClick);
}



function updateCount(data) {
    if (data.matches) {
        if (!$('#matchCountContainer').hasClass('active')) {
            $('#matchCountContainer').addClass("active");
            $('#matchCountContainer').on(ch, showMatches);
        }
        if (data.matches == 1) {
            var t = "1";
        } else {
            var t = data.matches;
        }
        $('#matchCount').text(t);
     }

    switch(getUser()) {
        case '0':
            $('#footer').text("You've liked " + data.u0 + " names, they've liked " + data.u1 + ".");
        break;
        case '1':
            $('#footer').text("You've liked " + data.u1 + " names, they've liked " + data.u0 + ".");
        break;
    }

}

function getUser() {
    if (window.uid) {
        var uidArr = uid.split('-');
        return uidArr[3];
    }
}

function setUser(uid) {
    $('.login').removeClass('active');
    //Set up Hammer.
    window.h = new Hammer(document.body, {
        recognizers: [
            [Hammer.Swipe, {direction: Hammer.DIRECTION_HORIZONTAL, velocity:.2, threshold:1}]
        ]
    });
    if ($('html').hasClass('touch')) {
       // console.log('touch-mode');
        //window.h.get('swipe').set({direction:Hammer.DIRECTION_HORIZONTAL});
        window.h.on('swipeleft', swipeLeft);
        window.h.on('swiperight', swipeRight);
    } else {
        console.log('tap-mode');
        window.h.on('tap', onTap);
    }

    window.uid = uid;

    //Do we have the uid in ls?
    var d = localStorage.getItem(uid);
    if (d) {
        //yep.
        //parse & keep playing.
        showNextName();

        //Update match count.;
        $.post("/vote/", {'uid':window.uid}, updateCount, "json");

    } else {

        //nope.
        //parse deets.
        var uidParts    = uid.split("-");
        uidParts.pop();
        window.gender   = uidParts.pop();

        createCookie('hasStarted',1,9999);

        localStorage.setItem("id", uid);
        //Create an empty matches array.
        localStorage.setItem("likes", JSON.stringify([]));
        //load gender data.
        $.getJSON("/data/" + gender + ".json").success(onNamesLoaded);
    }
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function addMatchingName(name) {
    var data = localStorage.getItem('likes');
    if (data) {
        data = JSON.parse(data);
    } else {
        //This should never happen...
        data = [];
    }

    data.push(name);

    localStorage.setItem('likes', JSON.stringify(data));
}

function removeMatchingName(name) {
    var data = localStorage.getItem('likes');
    if (data) {
        data = JSON.parse(data);
    } else {
        //This should never happen...
        data = [];
    }
    var index = data.indexOf(name);
    if (data > -1) {
        data.splice(index,1);
    }
    localStorage.setItem('likes', JSON.stringify(data));
}

function onNamesLoaded(data,status) {
    console.log('onNamesLoaded', data.length);
    //Shuffle it up upon initial load.
    //var names = shuffle(data);
    //On second thought, don't.  If the name of the game is to help them find matches, show them both
    //the same names in the same order.
    names = data;
    //Stow that shit away in ls.
    localStorage.setItem(window.uid, JSON.stringify(names));

    //Get this party started.
    showNextName();
}

function showNextName() {
    var names = $.parseJSON(localStorage.getItem(window.uid));
    console.log(names.length + ' names')

    if (names && names.length) {
        window.currentName = names[0];

        //$('.section.name').show();
        this.showSection('name');
        $('#name').text(window.currentName);
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function onNamesClick() {
    showSection('yourMatchesList');
    var m = $('.yourMatchesList ul#matches');
    m.empty();

    var names = localStorage.getItem('likes');
    if (names) {
        names = JSON.parse(names);
        if (names.length) {
            for(var i=0; i < names.length; i++) {
                var li = $("<li>"+names[i]+"</li>");
                m.append(li);
            }
        } else {
            var li = $("<li>You haven't liked any names yet.</li>");
            m.append(li);
        }
    }
}

function onLogoutClick() {
    if (confirm("You will lose all names.\nAre you sure?")) {
        localStorage.clear();
        eraseCookie('hasStarted');
        updateCount({'matches':0});
        window.uid = undefined;
        isLocked = false;
        $('#createUser').removeClass('disabled');
        showLogin();
    }
}

function onCloseClick() {
    console.log('onCloseClick');
    showSection('name');
}

function showSection(id) {
    if (id == window.currentSectionId) {
        return;
    }
    window.currentSectionId = id;
    $('.section').hide();
    $('#header ul li a').removeClass('active');
    switch(id) {
        case 'login':
            $('.login').show();
            $('#header').hide();
        break;
        case 'matchesList':
            $('.matchesList').show();
            $('#header').show();
        break;
        case 'about':
            $('.about').show();
            $('#header').show();
            $("ul li a.btn-about").addClass('active');

        break;
        case 'yourMatchesList':
            $('.yourMatchesList').show();
            $('#header').show();
            $("ul li a.btn-your-names").addClass('active');
        break;
        case 'name':
            $('.name').show();
            $('#header').show();
        break;
    }
}

function showLogin() {
    this.showSection('login');
    $('#create').submit(function(e) {
        //stop being a form, form.
        e.preventDefault();

        if (isLocked) { return false; }

        var email = $.trim($('#email').val());

        if (email && email.indexOf('@') > 0 && email.indexOf('.') > 0) {
            isLocked = true;
            //Yank values from form.
            var email = $('#email').val(), gender = $('input[name=gender]:checked').val();
            createUser(email, gender);
        } else {
            $('.login-email').addClass('has-error');
            $('#email').focus();
            return;
        }

    });

    $('#email').focus();
}

function onAboutClick() {
    showSection('about');
}

//click handler.
var ch, isLocked;

$(function() {
    ch = $('html').hasClass('touch') ? 'touchstart' : 'click';

    //Do we have stored data?
    var id  = localStorage.getItem("id"),
    hash    = location.hash;

    if (id) {
        window.uid = id;
        setUser(id);
    } else if (hash && hash.indexOf("@") > -1) {
        //Incoming user.
        hash = hash.split("/");
        hash = hash.pop();
        setUser(hash);

        location.hash = '';
    } else {
        showLogin();
    }

    $('#header .btn-your-names').on(ch, onNamesClick);
    $('#header .btn-logout').on(ch, onLogoutClick);
    $('#header .btn-about').on(ch, onAboutClick);

    $('.close-btn').on(ch, onCloseClick);

    //$('#header').on(ch, onHeaderClick);
});