<?php
    ini_set('auto_detect_line_endings',true);

    $dir = "./names/";
    $files = opendir($dir);

    $allNames       = array();
    $structNames    = array();

    while(($f = readdir($files)) !== FALSE) {
        $filename   = $dir . $f;
        if ($f != '.DS_Store') {
            $file       = fopen($filename, "r");
            while(($data = fgetcsv($file)) !== FALSE) {
                //Append name to $data.
                $name   = $data[0];
                $gender = $data[1];
                $count  = $data[2];
                if ($count > 150) {
                    //Only allow in a certain amount.
                    $allNames[$name] = 1;
                    $structNames[$gender][$name] = 1;
                }
            }
        }
    }


    //Make files.
    //All names, shuffled.
    $allNames = array_keys($allNames);
    shuffle($allNames);
    file_put_contents('all.json', json_encode($allNames));

    //Struct names, shuffled.
    foreach($structNames as $k=>$v) {
        $arr = array_keys($structNames[$k]);
        shuffle($arr);
        file_put_contents($k . '.json', json_encode($arr));
    }
