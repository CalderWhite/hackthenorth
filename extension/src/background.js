// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener
const $ = requireb('jquery');

chrome.runtime.onMessage.addListener(function(request, sender, callback) {  
  $.post("http://127.0.0.1:8080/api",{links:request.links})
    .done(function(data){
      callback(data);
    })
});