/**
 * Place your JS-code here.
 */
$(document).ready(function(){
  'use strict';
  
	function createChatWindow(window) {
		window.width(400);
		window.height(200);
		
		var websocket;
	
		function log(msg) {
			console.log(msg);
			$('#window-' + window.id + '-output').append('[' + new Date().toLocaleTimeString() + '] ' + msg + '<br>').scrollTop($('#window-' + window.id + '-output')[0].scrollHeight);
		}
		
		function handleMessage(message) {
			var msg = message.substr(1), params;
		
			params = msg.split(' ');
			
			if (params[0] == 'addchannel') {
				// Write channel name
			} else if (params[0] == 'removechannel') {
				$('#channel-' + params[1]).remove();
			}
		}
		
		function connect() {
			log('Connecting to: ws://www.chuckserver.se:1338');
			websocket = new WebSocket('ws://www.chuckserver.se:1338', 'chat-protocol');
		 
			websocket.onopen = function() {
				log('The websocket is now open.');
			}
		 
			websocket.onmessage = function(event) {
				if (event.data.charAt(0) == '/') {
					handleMessage(event.data);
				} else {
					log(event.data);
				}
			}
		 
			websocket.onclose = function() {
				log('The websocket is now closed.');
				$('#channels').empty();
			}
		}
		
		$('<div><div>')
			.attr('id', 'window-'+ window.id + '-output')
			.css('overflow', 'scroll')
			.height(window.getClientArea().h - 30)
			.width(window.w)
			.appendTo(window.window);
		
		$('<input>')
			.attr('id', 'window-' + window.id + '-message')
			.attr('placeholder', 'Message...')
			.width(200)
			.appendTo(window.window);
		
		$('<button>')
			.attr('id', 'window-' + window.id + '-send')
			.append('Send')
			.appendTo(window.window)
			.click(function () {
				if(!websocket || websocket.readyState === 3) {
					log('The websocket is not connected to a server.');
				} else {
					if ($('#window-' + window.id + '-message').val() == '/help') {
						log('Different commands: <br>* /name (name) - rename yourself<br>* /channel (channel) - change channel<br>* /me (action) - try it<br>* /w (user) (message) - Whisper to a user');
					} else {
						websocket.send($('#window-' + window.id + '-message').val());
					}
					$('#window-' + window.id + '-message').val('')
				}
			});
		connect();
		
		window.close(function() {
			if (!websocket || websocket.readystate === 3) {
			log('The websocket is not connected to a server.');
			} else {
				log('Closing websocket');
				websocket.close();
				websocket = false;
			}
		});
		
		window.resize(function() {
			console.log('Chat resize');
			$('#window-' + window.id + '-output')
				.height(window.getClientArea().h - 30)
				.width(window.getClientArea().w);
			$('#window-' + window.id + '-message')
				.width(window.getClientArea().w - $('#window-' + window.id + '-send').outerWidth(true) - 10)
		});
	}
	
	$('#interface').MDI({
		'windowtypes': {'chat': createChatWindow},
	});
});