<?php

$file = isset($_GET['filename']) ? $_GET['filename'] : false;
$data = isset($_POST['data']) ? $_POST['data'] : false;

if ($file && $data) {
	header('Content-Description: File Transfer');
	header('Content-Type: text/plain');
	header('Content-Disposition: attachment; filename='.$file);
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Pragma: public');
	header('Content-Length: ' . strlen($data));
	ob_clean();
	flush();
	echo $data;
}