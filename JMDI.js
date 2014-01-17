/**
 * See (@link {http://jquery.com/|jQuery API}).
 * @name jQuery
 * @class
 * See the jQuery Library  (http://jquery.com/) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */
 
/**
 * See (@link {http://jquery.com/|jQuery API}).
 * @name fn
 * @class
 * See the jQuery Library  (http://jquery.com/) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 * @memberOf jQuery
 */

/**
 * A basic callback without any parameters.
 *
 * @callback basicCallback
 */

/**
 * A basic window creation callback function that is 
 *
 * @callback windowCreationCallback
 * @param {MDIWindow}
 */

(function(){
	
	/**
     * JMDI - A jQuery plugin that can create and handle windows in an element.
     *
     * @class JMDI
     * @memberOf jQuery.fn
     */
	$.fn.JMDI = function(options){
		options = $.extend({}, $.fn.JMDI.defaults, options);
		
		var interf = this,			// The MDI element
		clientArea,					// The client area (where windows reside)
		windows = [],				// The windows (winId: window)
		clickedWindow,				// Currently dragged window
		nWindows = 0,				// Number of windows created
		windowOrder = new Array();	// Used to calculate the z-order of the windows
		
		/**
		 * Get the base element id based on the prependId and the id provided.
		 * @param {*} id - The provided id.
		 */
		function getId(id) {
			return options.prependId + 'window-' + id;
		}
		
		/**
		 * Represents a window.
		 * @constructor
		 * @param {*} id - The id of the window.
		 * @param {number} x - The x position of the window.
		 * @param {number} y - The y position of the window.
		 * @param {number} w - The width of the window when not in fullscreen.
		 * @param {number} h - The height of the window when not in fullscreen.
		 * @param {number} z - The z position of the window.
		 */
		function MDIWindow(id, x, y, w, h, z) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.z = z;
			
			this.fullscreen = false;
			
			this.lastX = 0;
			this.lastY = 0;
			this.window = null;
			
			this.onClose = function() {}
			this.onResize = function() {}
		}
		
		MDIWindow.prototype = {
			
			/**
			 * If the w parameter is set, this method sets the width of the actual window and returns this.
			 * If the w parameter is not set, this method returns the width of the actual window.
			 * @param {number} [w] - The width to set to the window.
			 */
			width: function(w) {
				if (w) {
					this.window.width(w);
					this.w = w;
					
					this.resize();
					
					return this;
				} else {
					return this.window.width();
				}
			},
			
			/**
			 * Returns {@link http://api.jquery.com/outerwidth/|jQuery .outerWidth()}.
			 */
			outerWidth: function(b) {
				return this.window.outerWidth(b);
			},
			
			/**
			 * If the h parameter is set, this method sets the height of the actual window and returns this.
			 * If the h parameter is not set, this method returns the height of the actual window.
			 * @param {number} [h] - The height to set to the window.
			 */
			height: function(h) {
				if (h) {
					this.window.height(h);
					this.h = h;
					
					this.resize();
					
					return this;
				} else {
					return this.window.height();
				}
			},
			
			/**
			 * Returns {@link http://api.jquery.com/outerheight/|jQuery .outerHeight()}.
			 */
			outerHeight: function(b) {
				return this.window.outerHeight(b);
			},
			
			/**
			 * If parameter f is specified it sets the function to call when a resize occurs.
			 * If parameter f is not set, it triggers the resize event.
			 * @param {basicCallback} [f] - The function to call when a window resize event occurs.
			 */
			resize: function(f) {
				if (!f) {
					this.onResize();
				} else {
					this.onResize = f;
				}
				
				return this;
			},
			
			/**
			 * If parameter f is specified it sets the function to call when closing the window.
			 * If parameter f is not set, it triggers the close event and closes the window.
			 * @param {basicCallback} [f] - The function to call when the window closes.
			 */
			close: function(f) {
				if (!f) {
					windowOrder.splice(this.z, 1);
			
					for (var i=0; i < windowOrder.length; i++) {
						windowOrder[i].window.css('z-index', i+1);
						windowOrder[i].z = i;
					}
					
					this.onClose();
					
					this.window.remove();
					
					delete windows[getId(this.id)];
				} else {
					
					this.onClose = f;
				}
				
				return this;
			},
			
			/**
			 * Toggle fullscreen mode for this window and triggers a resize event.
			 */
			toggleFullscreen: function() {
				this.fullscreen = !this.fullscreen;
				if (this.fullscreen) {
					this.window.css({
						'top': 0,
						'left': 0,
					}).height(clientArea.height())
					.width(clientArea.width());
				} else {
					this.window.css({
						'top': this.y,
						'left': this.x,
					}).height(this.h)
					.width(this.w);
				}
				
				this.resize();
			},
			
			/**
			 * Retrieves a jQuery element by using the provided id.
			 * This jQuery element is one that has been added by the addElement(tag, id) function.
			 * @param {*} id - The id to get.
			 */
			getElement: function(id) {
				return $('#' + getId(this.id) + '-' + id);
			},
			
			/**
			 * Adds an jQuery element with a generated id based on the provided id, appends it to the window and the returns the object created.
			 * This element can be retrieved by using the function getElement(id).
			 * @param {String} tag - A standard jQuery tag (e.g. <div>).
			 * @param {*} id - The provided id.
			 */
			addElement: function(tag, id) {
				var ret = $(tag);
				
				if (id) {
					ret.attr('id', getId(this.id) + '-' + id);
				}
				
				ret.appendTo(this.window);
				
				return ret;
			},
			
			/**
			 * Send this window to the foreground.
			 */
			sendToForeground: function() {
				windowOrder.splice(this.z, 1);
				windowOrder.push(this);
				
				for (var i=0; i < windowOrder.length; i++) {
					windowOrder[i].window.css('z-index', i+1);
					windowOrder[i].z = i;
				}
			},
			
			/**
			 * Get the client window width and height of this window.
			 * Returns an object {'w': width, 'h': height}.
			 */
			getClientArea: function() {
				var titlebar = $('#' + getId(this.id) + '-titlebar');
				if (!this.fullscreen) {
					return {'w': this.w, 'h': this.h - titlebar.outerHeight(true)};
				} else {
					return {'w': clientArea.innerWidth(), 'h': clientArea.innerHeight() - titlebar.outerHeight()};
				}
			}
		}
		
		/**
		 * Creates a new window with a titlebar, minimize/maximize and close button.
		 * @param {windowCreationCallback} windowfunction - The function called to create the content of the window.
		 */
		function createWindow(windowfunction) {
			console.log('Creating new window');
			
			var window = new MDIWindow(nWindows,
									options.defaultWindowPosX,
									options.defaultWindowPosY,
									options.defaultWindowWidth,
									options.defaultWindowHeight,
									windowOrder.length);
			
			var winId = getId(nWindows);
			
			nWindows++;
			
			windows[winId] = window;
			windowOrder.push(window);
			
			window.window = $('<div>')
				.addClass('window')
				.width(window.w)
				.height(window.h)
				.appendTo(clientArea)
				.attr('id', winId)
				.css({
					'z-index': windowOrder.length,
					'left': window.x,
					'top': window.y,
			}).mousedown(function () {
				var win = windows[$(this).attr('id')];
				win.sendToForeground();
			});
			
			window.addElement('<div>', 'titlebar')
				.append($('<span>')
					.addClass('windowTitle')
					.append(winId)
				).addClass('windowbar')
				.mousedown(function(event) {
					var win = windows[$(this).parent().attr('id')];
					
					if (!win.fullscreen) {
						var parentOffset = $(this).parent().parent().offset();
						win.lastX = event.pageX - parentOffset.left;
						win.lastY = event.pageY - parentOffset.top;
						
						clickedWindow = win;
						
						event.preventDefault();
					}
				}).mouseup(function(event) {
					var parentOffset = $(this).parent().parent().offset();
					var relX = event.pageX - parentOffset.left;
					var relY = event.pageY - parentOffset.top;
					
					clickedWindow = false;
				}).append($('<a>')
					.append('x')
					.attr('href', '#')
					.addClass('closebutton')
					.click(function() {
						console.log('Clicked close');
						var win = windows[$(this).parent().parent().attr('id')];
						win.close();
					})
				).append($('<a>')
					.append('-')
					.attr('href', '#')
					.addClass('minmaxbutton')
					.click(function() {
						console.log('Clicked min/max button');
						var win = windows[$(this).parent().parent().attr('id')];
						win.toggleFullscreen();
					})
				);
			
			windowfunction(window);
			window.resize();
		}
		
		/**
		 * See windowCreationCallback.
		 * 
		 * Used to create a simple text editor window.
		 * @param {MDIWindow} window - The window to append the content to.
		 */
		function createTextEdit(window) {
			
			function onSave() {
				var data = window.getElement('text').val();
				
				if (data.length > 0) {
					var filename=prompt("What would you like to save the file as?","default.txt")
					
					if (filename != null) {
						var form = $('<form>').appendTo($('body'));
						
						form.attr({
							'id': 'save_form',
							'action': 'getfile.php?filename=' + filename,
							'method': 'post',
							'target': '_blank'
						});
						
						form.append($('<input>')
							.attr({
								'name': 'data',
								'type': 'hidden',
								'value': data,
							})
						);
						
						form.submit();
						
						form.remove();
					}
				}
			}
			
			window.addElement('<textarea>', 'text')
				.css({
					'width': window.w - 10,
					'height': window.h - 57,
					'resize': 'none',
				}
			);
			
			window.addElement('<button>')
				.append('Save')
				.click(function() {
					onSave();
				}
			);
			
			window.resize(function() {
				window.getElement('text')
					.height(window.getClientArea().h - 35)
					.width(window.getClientArea().w - 10);
			});
			
			window.close(function() {
				onSave();
			});
		}
		
		/**
		 * Initializes the MDI.
		 * Creates the menu, menu items and the MDI client area. 
		 */
		function initInterface() {
			console.log('Initiating interface');
			interf.empty();
			
			interf.addClass('interface');
			interf.css({
				'width': options.width,
				'height': options.height
			});
			
			var menu = $('<nav></nav>').addClass('menu').appendTo(interf);
			
			clientArea = $('<div></div>').addClass('clientArea')
				.width(options.width)
				.height(options.height - menu.height())
				.mouseout(function (event) {
					if (clickedWindow) {
						var win = clickedWindow;
						var parentOffset = $(this).offset();
						var relX = event.pageX - parentOffset.left;
						var relY = event.pageY - parentOffset.top;
						
						var nLeft = win.window.position().left + (relX - win.lastX);
						var nTop = win.window.position().top + (relY - win.lastY);
						
						if (nLeft < 0 || nLeft + win.w > $(this).width() || nTop < 0 ||nTop + win.h > $(this).height()) {
							if (nLeft < 0) {
								nLeft = 0;
							} else if (nLeft + win.outerWidth(true) > $(this).width()) {
								nLeft = $(this).width() - win.outerWidth(true);
							}
							
							if (nTop < 0) {
								nTop = 0;
							} else if (nTop + win.outerHeight(true) > $(this).height()) {
								nTop = $(this).height() - win.outerHeight(true);
							}
							
							win.window.css({
								'left': nLeft,
								'top': nTop,
							});
							
							win.x = nLeft;
							win.y = nTop;
							clickedWindow = false;
						}
					}
				}).mousemove(function(event) {
					if (clickedWindow) {
						var win = clickedWindow;
						var parentOffset = $(this).offset();
						var relX = event.pageX - parentOffset.left;
						var relY = event.pageY - parentOffset.top;
						
						var nLeft = win.window.position().left + (relX - win.lastX);
						var nTop = win.window.position().top + (relY - win.lastY);
						
						if (nLeft < 0) {
							nLeft = 0;
						} else if (nLeft + win.outerWidth(true) > $(this).width()) {
							nLeft = $(this).width() - win.outerWidth(true);
						}
						
						if (nTop < 0) {
							nTop = 0;
						} else if (nTop + win.outerHeight(true) > $(this).height()) {
							nTop = $(this).height() - win.outerHeight(true);
						}
						
						win.window.css({
							'left': nLeft,
							'top': nTop,
						});
						
						win.lastX = relX;
						win.lastY = relY;
						
						win.x = nLeft;
						win.y = nTop;
					}
			}).appendTo(interf);
			
			var menuItems = $('<ul></ul>');
			
			var menuItem = $('<li></li>').append(
				$('<a>New...</a>')
					.attr('href', '#')
			).appendTo(menuItems);
			
			var filelist = $('<ul></ul>').appendTo(menuItem);
			
			$('<li></li>').append(
				$('<a>Textfile</a>')
					.attr('href', '#')
					.click(function() {
						createWindow(createTextEdit);
					})
			).appendTo(filelist);
			
			for (var key in options.windowtypes) {
				if (options.windowtypes.hasOwnProperty(key)) {
					$('<li></li>').append(
						$('<a>'+key+'</a>')
							.attr('href', '#')
							.click(function() {
								createWindow(options.windowtypes[key]);
							})
					).appendTo(filelist);
				}
			}
			
			menuItems.appendTo(menu);
		}
		
		initInterface();
		
		return this;
	};
	
	/**
	 * Default option values for the MDI.
	 */
	$.fn.JMDI.defaults = {
		'width': 700,
		'height': 400,
		'prependId': '',
		'defaultWindowPosX': 20,
		'defaultWindowPosY': 20,
		'defaultWindowHeight': 150,
		'defaultWindowWidth': 200,
		'windowtypes': {},
		'showDefaultWindowType': true
	}
}) (jQuery);