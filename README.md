JMDI
====

A Multiple Document Interface jQuery plugin for JavaScript.

Installation and Usage
----------------------

This jQuery plugin has been tested with v1.10.2 of jQuery.

### Usage

The JMDI plugin mainly consists of 3 files:
`JMDI.js` - The JavaScript file containing the plugin.
`JMDI.css` - The stylesheet for the MDI.
`getfile.php` - The PHP script that creates the files that gets saved from the basic Textfile windows.

#### Simple example

First create a file named `example.html`:
```html
<!doctype html>
<html lang='en' class='no-js'>
<head>
	<meta charset='utf-8' />
	<title>Simple example</title>
	<link rel="stylesheet" type="text/css" href="JMDI.css">
</head>
<body> 
	<h1>Simple example of a JavaScript MDI</h1>
	<div id='interface'>
	</div>
	<script src="js/jquery.min.js"></script>
	<script src="JMDI.js"></script>
	<script src="example.js"></script>
</body>
</html>
```

And then create the file `example.js`:
```javascript
$(document).ready(function(){
	'use strict';
	
	$('#interface').JMDI();
});
```

The script takes the `interface` div and turns it into a MDI.