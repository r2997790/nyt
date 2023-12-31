<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $target_dir = "https://www.inlineeducation.com/ul/";
    $target_file = $target_dir . basename($_FILES["video"]["name"]);

    if (move_uploaded_file($_FILES["video"]["tmp_name"], $target_file)) {
        // Email the file
        $to = 'nayrsllew@gmail.com';
        $subject = 'Recorded Video';
        $message = 'Please find the recorded video attached.';
        $headers = 'From: webmaster@example.com' . "\r\n";
        $headers .= 'Content-Type: multipart/mixed; boundary="PHP-mixed-' . rand() . '"' . "\r\n";

        $attachment = chunk_split(base64_encode(file_get_contents($target_file)));

        $body = '--PHP-mixed-' . rand() 
            . "\r\n" . 'Content-Type: video/webm; name="' . basename($target_file) . '"' 
            . "\r\n" . 'Content-Transfer-Encoding: base64' 
            . "\r\n" . 'Content-Disposition: attachment' 
            . "\r\n\r\n" . $attachment . "\r\n\r\n" 
            . '--PHP-mixed-' . rand() . '--';

        mail($to, $subject, $body, $headers);

        echo "The video has been emailed successfully.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>
