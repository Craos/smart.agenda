<?php
/**
 * Created by PhpStorm.
 * User: oberdanbrito
 * Date: 11/11/18
 * Time: 14:24
 * action=loadImage&itemId=user_photo&itemValue=avatar.jpg&dhxr1441638923235=1
 */

@session_start();
$idd = session_id();

// this part is for loading image into item
if (@$_REQUEST["action"] == "loadImage") {

    // load any default image
    $i = "foto/default.png";

    // check if requested image exists
    $k = "foto/".$_REQUEST["itemValue"];
    if (file_exists($k)) $i = $k;

    // output image
    header("Content-Type: image/jpg");
    print_r(file_get_contents($i));

}

// this part is for uploading the new one
if (@$_REQUEST["action"] == "uploadImage") {

    $filename = md5($_FILES["file"]["name"]).'.jpg';

    @unlink("foto/".$filename);

    $small = "foto/small_".$filename;
    $medium = "foto/medium_".$filename;
    $large = "foto/large_".$filename;

    copy($_FILES["file"]["tmp_name"], $small);
    copy($_FILES["file"]["tmp_name"], $medium);
    copy($_FILES["file"]["tmp_name"], $large);

    resize_image(300,$small);
    resize_image(800,$medium);

    header("Content-Type: text/html; charset=utf-8");
    print_r("{state: true, itemId: '".@$_REQUEST["itemId"]."', itemValue: '".str_replace("'","\\'", 'small_'.$filename)."'}");

}

function resize_image($maxDim, $file) {

    $file_name = $file;
    list($width, $height, $type, $attr) = getimagesize( $file_name );
    if ( $width > $maxDim || $height > $maxDim ) {
        $target_filename = $file_name;
        $ratio = $width/$height;
        if( $ratio > 1) {
            $new_width = $maxDim;
            $new_height = $maxDim/$ratio;
        } else {
            $new_width = $maxDim*$ratio;
            $new_height = $maxDim;
        }

        $src = imagecreatefromstring( file_get_contents( $file_name ) );
        $dst = imagecreatetruecolor( $new_width, $new_height );
        imagecopyresampled( $dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height );
        imagedestroy( $src );
        imagepng( $dst, $target_filename ); // adjust format as needed
        imagedestroy( $dst );
    }
}