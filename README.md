JMDI
====

A Multiple Document Interface jQuery plugin for JavaScript.

Installation and Usage
----------------------

This jQuery plugin has been tested with v1.10.2 of jQuery.

# # # Usage

# # # # Simple example

First the file example.html:
```html
<!doctype html>
<html lang='en' class='no-js'>
<head>
	<meta charset='utf-8' />
	<title>Simple example</title>
	<link rel="stylesheet" type="text/css" href="JMDI.css">
</head>
<body> 
	<h1>Simple example of an </h1>
	<div id='interface'>
	</div>
	<script src="js/jquery.min.js"></script>
	<script src="JMDI.js"></script>
	<script src="example.js"></script>
</body>
</html>
```

And then in the file example.js:
```javascript
$(document).ready(function(){
	'use strict';
	
	$('#interface').JMDI();
});
```