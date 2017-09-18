// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener
const HOST = "localhost"
const PORT = "8080"
const $ = require('jquery');

var isExtensionOn = null;
var funcToCall = null;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "setOnOffState") {
		isExtensionOn = request.data.value;
	}
	if (isExtensionOn) {
		funcToCall();
	}
})

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
	if(request === "sendmain") {
		funcToCall = callback;
		return true;
	}
	if (!isExtensionOn) {
		return true;
	}
	if (request.isReport) {
		if (!request || !request.title || !request.url) {
			return true;
		}
		$.post("http://"+HOST+":"+PORT+"/api/report", request)
		.done(function(data){
		  callback(request);
		})
		.fail(function(){
		  callback(null);
		})
	} else {
		if (!request || !request.links) {
			return true;
		}
		$.post("http://"+HOST+":"+PORT+"/api",{links:request.links})
		.done(function(data){
		  callback(data);
		})
		.fail(function(){
		  callback(null);
		})
	}
	return true;
});