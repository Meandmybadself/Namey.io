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
    $.post("create/",
        {'uid':uid, 'email':$('#email').val()},
        onUserCreated,
        "json"
        ).error(onError);
}

function onError() {
    console.log('onError', arguments);
    alert("Something's broken.");
   // alert('duh...');
}

function onUserCreated() {
    setUser(window.uid);
}

function onSwipe() {
    if ($('matchesList').hasClass('active')) {
        return;
    }
    console.log('onSwipe', window.currentName);
}
function onTap(e) {
    if ($('matchesList').hasClass('active')) {
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

function swipeLeft() {
    if ($('matchesList').hasClass('active')) {
        return;
    }
    popName();
    showNextName();
}

function swipeRight() {
    if ($('matchesList').hasClass('active')) {
        return;
    }
    $.post("vote/",
        {'uid':window.uid, 'name':window.currentName},
        updateCount,
        "json"
    ).error(onError);

    popName();
    showNextName();
}

function showMatches() {
    $.post('vote/',
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
    $('.name').hide();
    $('.matchesList').show();
    $('#close-matches').on(ch, closeShowMatches);
}

function closeShowMatches() {
    $('.name').show();
    $('.matchesList').hide();
    $('#close-matches').off(ch, closeShowMatches);
}

function updateCount(data) {
    console.log('updateCount');
    if (data.matches) {
        if (!$('#matchCountContainer').hasClass('active')) {
            $('#matchCountContainer').addClass("active");
            $('#matchCountContainer').on(ch, showMatches);
        }
        if (data.matches == 1) {
            var t = "1 match";
        } else {
            var t = data.matches + " matches";
        }
        $('#matchCount').text(t);

    }
}

function setUser(uid) {
    $('.login').hide();

    //Set up Hammer.
    window.h = new Hammer(document.getElementById('main'));
   // if ($('html').hasClass('touch')) {
       // console.log('touch-mode');
        window.h.get('swipe').set({direction:Hammer.DIRECTION_HORIZONTAL});
        window.h.on('swipeleft', swipeLeft);
        window.h.on('swiperight', swipeRight);
    //} else {
     //   console.log('tap-mode');
        window.h.on('tap', onTap);
   // }

   window.uid = uid;



    //Do we have the uid in ls?
    var d = localStorage.getItem(uid);
    if (d) {
        //yep.
        //parse & keep playing.
        showNextName();

        //Update match count.;
        $.post("vote/", {'uid':window.uid}, updateCount, "json");

    } else {

        //nope.
        //parse deets.
        var uidParts    = uid.split("-");
        uidParts.pop();
        window.gender   = uidParts.pop();

        localStorage.setItem("id", uid);
        //load gender data.
        $.getJSON("data/" + gender + ".json").success(onNamesLoaded);
    }
}

function onNamesLoaded(data,status) {
    //console.log('onNamesLoaded');
    //Shuffle it up upon initial load.
    var names = shuffle(data);
    //Stow that shit away in ls.
    localStorage.setItem(window.uid, JSON.stringify(names));

    //Get this party started.
    showNextName();
}

function showNextName() {
    var names = $.parseJSON(localStorage.getItem(window.uid));

    if (names && names.length) {
        window.currentName = names[0];

        $('.section.name').show();
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
        $('.login').show();
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
});