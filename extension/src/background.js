// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener
const HOST = "127.0.0.1"
const PORT = "8080"
const $ = require('jquery');

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	$.post("http://"+HOST+":"+PORT+"/api",{links:request.links})
	.done(function(data){
	  //const j = JSON.parse(data);
	  callback(data);
	})
	.fail(function(data){
	  callback({links:request.links,err:true});
	})
	return true;
});