<?php
    $matches    = 0;
    if (isset($_POST['uid'], $_POST['name'])) {
        //cast vote.
        //open this user's data store.
        //does the data store exist?
        //TODO - sanitize.
        $uid        = strtolower(trim($_POST['uid']));
        $name       = trim($_POST['name']);
        $uidArr     = explode("-", $uid);

        //Strip the user off the uid.
        $user       = array_pop($uidArr);
        $uid        = implode("-", $uidArr);
        //$user       = intval($_POST['user']);
        $filename   = 'users/' . $uid;
        if (!is_file($filename)) {
            $data[$name][$user] = 1;
        } else {
            //We have an existing user.
            $data = unserialize(file_get_contents($filename));
            $data[$name][$user] = 1;
        }

        //var_dump($data);

        //Persist data.
        file_put_contents($filename, serialize($data));

        //Scan through data, looking for matches on 0 & 1
        //TODO - optimize
        foreach($data as $name=>$usermatches) {
            if (isset($usermatches[0], $usermatches[1])) {
                $matches++;
            }
        }

        echo json_encode(array('matches'=>$matches));

    } elseif(isset($_POST['uid'], $_POST['list'])) {
        //just return the number of matches for the user.
        $uid        = strtolower(trim($_POST['uid']));
        $uidArr     = explode("-", $uid);
        $user       = array_pop($uidArr);
        $uid        = implode("-", $uidArr);

        $filename   = 'users/' . $uid;

        $matchingNames  = array();

        if (is_file($filename)) {
            $data = unserialize(file_get_contents($filename));

            foreach($data as $name=>$usermatches) {
                if (isset($usermatches[0], $usermatches[1])) {
                    $matchingNames[] = $name;
                }
            }
        }

        echo json_encode($matchingNames);
    } elseif(isset($_POST['uid'])) {
        //just return the number of matches for the user.
        $uid        = strtolower(trim($_POST['uid']));
        $uidArr     = explode("-", $uid);
        $user       = array_pop($uidArr);
        $uid        = implode("-", $uidArr);

        $filename   = 'users/' . $uid;

        if (is_file($filename)) {
            foreach($data as $name=>$usermatches) {
                if (isset($usermatches[0], $usermatches[1])) {
                    $matches++;
                }
            }
        }

        echo json_encode(array('matches'=>$matches));
    }
?>