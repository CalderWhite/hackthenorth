// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener
const HOST = "localhost"
const PORT = "8080"
const $ = require('jquery');

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	$.post("http://"+HOST+":"+PORT+"/api",{links:request.links})
	.done(function(data){
	  //const j = JSON.parse(data);
	  callback(data);
	})
	.fail(function(data){
	  callback(null);
	})
	return true;
});