// this code runs on every page opened
const $ = require('jquery');
var wait = false;

/* OLD CODE:::
function scrapeGmail(){
  var exp = /#inbox\/[a-zA-Z0-9]+/;
  // check to see that they are in fact viewing an email, not just at their inbox
  if(window.location.href.toString().match(exp) == null){return}
  // grab the data
  const from = document.getElementsByClassName("gD")[0].dataset.hovercardId;
  const subject = document.getElementsByClassName("hP")[0].textContent;
  const content = document.getElementsByClassName("aXjCH").innerHTML;
  const pkg = {
    "from" : from,
    "subject" : subject,
    "messages" : [content]
  }
  return pkg
} :::: OLD CODE
*/
function scrapeFacebookMessanger(){
  var exp = /t\/[a-zA-Z0-9]+/
  if(window.location.href.toString().match(exp) == null){return}


  var chat = document.getElementsByClassName("_aok");

  var dump = ""
  // find the messages not from the current user.
  var last = true;
  for (var i = 0;i<chat.length; i++) {
    if(chat[i].parentElement.dataset.tooltipPosition === "left"){
      dump+=chat[i].innerHTML;
    }
  };
  var links = [];
  var tree = $.parseHTML("<div>"+dump+"</div>");
  $(tree).find('a').each(function() {
    links.push($(this).attr('href'));
  });
  return links;
}
function scrapeGmail(){
  var links = [];
  $('.adn').find('a').each(function() {
    links.push($(this).attr('href'));
  });
  return links;
}
const index = {
  "mail.google.com" : scrapeGmail,
  "https://www.facebook.com/messages/t/": scrapeFacebookMessanger
}

function main(){
  if(!wait){
    var k = Object.keys(index);
    for(var i=0;i<k.length;i++){
      if(window.location.href.toString().search(k[i]) > -1){
        var data = index[k[i]]();
        chrome.runtime.sendMessage({
          links : data,
          data: ''
        }
      }
    }
    // throttling
    wait = true;
    setTimeout(function(){
      wait=false;
    },1000);
  }
}
$(document).ready(main);
$(document).bind('DOMSubtreeModified', function () {
  main();
});


console.log("Hello World from content.");
