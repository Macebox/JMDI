/**
 * Place your JS-code here.
 */
$(document).ready(function(){
  'use strict';
	function ChatSocket(server, output) {
		this.server = server;
		this.websocket = null;
		
		this.output = output;
	}
	
	ChatSocket.prototype = {
		log: function(msg) {
			console.log(msg);
			this.output.append('[' + new Date().toLocaleTimeString() + '] ' + msg + '<br>').scrollTop(this.output[0].scrollHeight);
		},
		
		handleMessage: function(message) {
			var msg = message.substr(1), params;
		
			params = msg.split(' ');
			
			if (params[0] == 'addchannel') {
				this.log('* Channel ' + params[1] + ' added!');
			} else if (params[0] == 'removechannel') {
				this.log('* Channel ' + params[1] + ' removed!');
			}
		},
		
		connect: function() {
			var t = this;
			this.log('Connecting to: ' + this.server);
			this.websocket = new WebSocket(this.server, 'chat-protocol');
		 
			this.websocket.onopen = function() {
				t.log('The websocket is now open.');
			};
		 
			this.websocket.onmessage = function(event) {
				if (event.data.charAt(0) == '/') {
					t.handleMessage(event.data);
				} else {
					t.log(event.data);
				}
			};
		 
			this.websocket.onclose = function() {
				t.log('The websocket is now closed.');
			};
		},
		
		close: function() {
			if (!this.websocket || this.websocket.readystate === 3) {
			this.log('The websocket is not connected to a server.');
			} else {
				this.log('Closing websocket');
				this.websocket.close();
				this.websocket = false;
			}
		},
		
		sendMessage: function(message) {
			var ret = false;
			if(!this.websocket || this.websocket.readyState === 3) {
					this.log('The websocket is not connected to a server.');
			} else {
				if (message == '/help') {
					this.log('Different commands: <br>* /name (name) - rename yourself<br>* /channel (channel) - change channel<br>* /me (action) - try it<br>* /w (user) (message) - Whisper to a user');
				} else {
					this.websocket.send(message);
				}
				ret = true;
			}
			
			return ret;
		}
	}
  
	function createChatWindow(window) {
		window.width(400);
		window.height(200);
		
		var chatsocket;
		
		window.addElement('<div>', 'output')
			.css('overflow', 'scroll')
			.height(window.getClientArea().h - 30)
			.width(window.w);
			
		window.addElement('<input>', 'message')
			.attr('placeholder', 'Message...')
			.width(200);
			
		window.addElement('<button>', 'send')
			.append('Send')
			.click(function () {
				if (chatsocket.sendMessage(window.getElement('message').val())) {
					window.getElement('message').val('');
				}
			}
		);
		
		chatsocket = new ChatSocket('ws://www.chuckserver.se:1338', window.getElement('output'));
		
		chatsocket.connect();
		
		window.close(function() {
			chatsocket.close();
		});
		
		window.resize(function() {
			console.log('Chat resize');
			window.getElement('output')
				.height(window.getClientArea().h - 30)
				.width(window.getClientArea().w);
			window.getElement('message')
				.width(window.getClientArea().w - window.getElement('send').outerWidth(true) - 10)
		});
	}
	
	$('#interface').JMDI({
		'windowtypes': {'chat': createChatWindow},
	});
});