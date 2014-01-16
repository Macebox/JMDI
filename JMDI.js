(function(){
	$.fn.MDI = function(options){
		options = $.extend({}, $.fn.MDI.defaults, options);
		
		var interf = this, taskbar, taskbarlist, clientArea, windows = [], clickedWindow, nWindows = 0, windowOrder = new Array();
		
		function Window(id, x, y, w, h, z) {
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
		
		Window.prototype = {
			width: function(w) {
				this.window.width(w);
				this.w = w;
			},
			
			height: function(h) {
				this.window.height(h);
				this.h = h;
			},
			
			resize: function(f) {
				this.onResize = f;
			},
			
			close: function(f) {
				this.onClose = f;
			},
			
			getClientArea: function() {
				var titlebar = $('#window-' + this.id + '-titlebar');
				if (!this.fullscreen) {
					return {'w': this.w, 'h': this.h - titlebar.outerHeight(true)};
				} else {
					return {'w': clientArea.innerWidth(), 'h': clientArea.innerHeight() - titlebar.outerHeight()};
				}
			}
		}
		
		function resizeWindow(window) {
			if (window.fullscreen) {
				window.window.css({
					'top': 0,
					'left': 0,
				}).height(clientArea.height())
				.width(clientArea.width());
			} else {
				window.window.css({
					'top': window.y,
					'left': window.x,
				}).height(window.h)
				.width(window.w);
			}
			
			window.onResize();
		}
		
		function removeWindow(window) {
			windowOrder.splice(window.z, 1);
			
			for (var i=0; i < windowOrder.length; i++) {
				windowOrder[i].window.css('z-index', i+1);
				windowOrder[i].z = i;
			}
			
			window.onClose();
			
			window.window.remove();
			
			delete windows['window-' + window.id];
		}
		
		function changeWindowToTop(window) {
			windowOrder.splice(window.z, 1);
			windowOrder.push(window);
			
			for (var i=0; i < windowOrder.length; i++) {
				windowOrder[i].window.css('z-index', i+1);
				windowOrder[i].z = i;
			}
		}
		
		function createWindow(windowfunction) {
			console.log('Creating new window');
			
			var window = new Window(nWindows, options.defaultWindowPosX, options.defaultWindowPosY, options.defaultWindowWidth, options.defaultWindowHeight, windowOrder.length);
			var winId = 'window-' + nWindows;
			
			nWindows++;
			
			windows[winId] = window;
			windowOrder.push(window);
			
			window.window = $('<div></div>').addClass('window')
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
				changeWindowToTop(win);
			}).append($('<div></div>')
				.append($('<span>' + winId + '</span>').addClass('windowTitle'))
				.addClass('windowbar')
				.attr('id', winId + '-titlebar')
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
				}).append($('<a>x</a>').attr('href', '#').addClass('closebutton').click(function() {
					console.log('Clicked close');
					var win = windows[$(this).parent().parent().attr('id')];
					removeWindow(win);
				})).append($('<a>-</a>').attr('href', '#').addClass('minmaxbutton').click(function() {
					console.log('Clicked min/max button');
					var win = windows[$(this).parent().parent().attr('id')];
					win.fullscreen = !win.fullscreen;
					
					resizeWindow(win);
				}))
			);
			
			windowfunction(window);
		}
		
		function createTextEdit(window) {
			window.window.append($('<textarea></textarea>')
				.attr('id', 'window-' + window.id + '-text')
				.css({
					'width': window.w - 10,
					'height': window.h - 57,
					'resize': 'none',
				})
			).append($('<button>Save</button>').click(function() {
				var filename=prompt("What would you like to save the file as?","default.txt")
				
				if (filename != null) {
					var form = $('<form></form>').appendTo($('body'));
					var data = $('#window-' + window.id + '-text').val();
					
					form.attr({
						'id': 'save_form',
						'action': 'getfile.php?filename=' + filename,
						'method': 'post',
						'target': '_blank'
					});
					
					form.append($('<input>').attr({
						'name': 'data',
						'type': 'hidden',
						'value': data,
					}));
					
					form.submit();
					
					form.remove();
				}
			}));
			
			window.resize(function() {
				$('#window-' + window.id + '-text')
					.height(window.getClientArea().h - 35)
					.width(window.getClientArea().w - 10);
			});
		}
		
		function initInterface() {
			console.log('Initiating interface');
			interf.empty();
			
			interf.addClass('interface');
			interf.css({
				'width': options.width,
				'height': options.height
			});
			
			taskbar = $('<nav></nav>').addClass('taskbar').appendTo(interf);
			
			clientArea = $('<div></div>').addClass('clientArea')
				.width(options.width)
				.height(options.height - taskbar.height())
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
							} else if (nLeft + win.w > $(this).width()) {
								nLeft = $(this).width() - win.w;
							}
							
							if (nTop < 0) {
								nTop = 0;
							} else if (nTop + win.h > $(this).height()) {
								nTop = $(this).height() - win.h;
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
						} else if (nLeft + win.w > $(this).width()) {
							nLeft = $(this).width() - win.w;
						}
						
						if (nTop < 0) {
							nTop = 0;
						} else if (nTop + win.h > $(this).height()) {
							nTop = $(this).height() - win.h;
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
			
			taskbarlist = $('<ul></ul>');
			
			var menu = $('<li></li>').append(
				$('<a>New...</a>')
					.attr('href', '#')
			).appendTo(taskbarlist);
			
			var filelist = $('<ul></ul>').appendTo(menu);
			
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
			
			taskbarlist.appendTo(taskbar);
		}
		
		initInterface();
		
		return this;
	};
	
	$.fn.MDI.defaults = {
		'width': 700,
		'height': 400,
		'defaultWindowPosX': 20,
		'defaultWindowPosY': 20,
		'defaultWindowHeight': 150,
		'defaultWindowWidth': 200,
		'windowtypes': {}
	}
}) (jQuery);