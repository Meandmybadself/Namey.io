<?php
    $matches    = 0;


    if (isset($_POST['uid'], $_POST['name'])) {
        //cast vote.


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

        //Persist data.
        file_put_contents($filename, serialize($data));

        $user0Matches = 0;
        $user1Matches = 0;
        //Scan through data, looking for matches on 0 & 1
        //TODO - optimize
        foreach($data as $name=>$usermatches) {
            if (isset($usermatches[0])) {
                $user0Matches++;
            }
            if (isset($usermatches[1])) {
                $user1Matches++;
            }

            if (isset($usermatches[0], $usermatches[1])) {
                $matches++;
            }
        }

        echo json_encode(array('matches'=>$matches, 'u0'=>$user0Matches, 'u1'=>$user1Matches));

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

        $user0Matches = 0;
        $user1Matches = 0;
        //Scan through data, looking for matches on 0 & 1
        if (is_file($filename)) {
            $data = unserialize(file_get_contents($filename));
            foreach($data as $name=>$usermatches) {
                if (isset($usermatches[0])) {
                    $user0Matches++;
                }
                if (isset($usermatches[1])) {
                    $user1Matches++;
                }
                if (isset($usermatches[0], $usermatches[1])) {
                    $matches++;
                }
            }
        }

        echo json_encode(array('matches'=>$matches, 'u0'=>$user0Matches, 'u1'=>$user1Matches));
    }
?>