<?php
    if (isset($_POST['uid'], $_POST['name'], $_POST['user'])) {
        //cast vote.
        //open this user's data store.
        //does the data store exist?
        //TODO - sanitize.
        $uid        = strtolower(trim($_POST['uid']));
        $name       = trim($_POST['name']);
        $user       = intval($_POST['user']);
        $filename   = 'users/' . $uid;
        if (!is_file($filename)) {
            $data[$name][$user] = 1;
        } else {
            //We have an existing user.
            $data = unserialize(file_get_contents($filename));
            $data[$name][$user] = 1;
        }

        //Burn through data, looking for matches on 0 & 1.


    } elseif(isset($_POST['uid'])) {
        //just return the number of matches for the user.

    }
?>