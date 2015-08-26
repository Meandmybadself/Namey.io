<?php
    if (isset($_POST['uid'], $_POST['email'])) {
        $uid    = $_POST['uid'];

        //This is coming from the 0 user.  Change this uid into the 1 user.
        $uidArr = explode("-", $uid);
        $uidArr[count($uidArr) - 1] = "1";
        $uid    = implode("-", $uidArr);

        $email  = $_POST['email'];

        $interactionURL = "http://" . $_SERVER['HTTP_HOST'] . "/#/uid/" . $uid;
        $msg = "Find a name for your baby at:\n$interactionURL";

        //header("Content-type:application/javascript");
        if (mail($email, "Find a baby name.", $msg)) {
            echo json_encode(array("stat"=>"ok"), JSON_PRETTY_PRINT);
        } else {
            echo json_encode(array("stat"=>"err"), JSON_PRETTY_PRINT);
        }
    }
?>