JMDI
====

A Multiple Document Interface jQuery plugin for JavaScript.

Installation and Usage
----------------------

This jQuery plugin has been tested with v1.10.2 of jQuery.

### Installation
To install, just pull the repository to your server.

The JMDI plugin mainly consists of 3 files which are needed:
* `JMDI.js` - The JavaScript file containing the plugin.
* `JMDI.css` - The stylesheet for the MDI.
* `getfile.php`(optional) - The PHP script that creates the files that gets saved from the basic Textfile windows.

### Usage

#### Simple example
This example shows how to initialize the JMDI, which is able to create windows with text writers which can be saved to disk.

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

#### Parameters
To input parameters to JMDI just use the following:
```javascript
.JMDI({
    'paramName': 'paramValue'
});
```

The following parameters are supported:
*  width - The width of the interface in pixels.
*  height - The height of the interface in pixels.
*  prependId - The suffix to use for all element id's, to make them unique.
*  defaultWindowPosX - The default upper left corner x position for new windows.
*  defaultWindowPosY - The default upper left corner y position for new windows.
*  defaultWindowHeight - The default height for new windows.
*  defaultWindowWidth - The default width for new windows.
*  windowtypes - "Map" of window name -> window creation function.
*  showDefaultWindowType - Set to true if the default Textfile option should be available in New... .

#### Example with another type of window

Use the same html file as in the above example.

Replace `example.js` with:
```javascript
$(document).ready(function(){
	'use strict';
	
	function createSimpleWindow(window) {
		window.addElement('<div>', 'hw')
			.append('Hello World!')
			.css('background-color', '#ABABAB');
		
		window.resize(function() {
			console.log('Window has been resized!');
			window.getElement('hw')
				.height(window.getClientArea().h)
				.width(window.getClientArea().w);
		});
		
		window.close(function() {
			console.log('Window is closing!')
		});
	}
	
	$('#interface').JMDI({
		'windowtypes': {'simple': createSimpleWindow}
	});
});
```
When looking at the page now, there are two alternatives in the "New..." menu, `Textfile` and `simple`. When clicking on `simple` a new simple window is created. When maximizing and minimizing the window, the resize event function is called. When closing the window, the close event function is called. This can be confirmed by looking in the debug console.
