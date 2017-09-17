// this code runs on every page opened
const $ = require('jquery');
var wait = false;

// scraping functions
function scrapeFacebookMessanger(){
  var exp = /t\/[a-zA-Z0-9]+/
  if(window.location.href.toString().match(exp) == null) {
    return null;
  }

  var chat = document.getElementsByClassName("_aok");

  // find the message
  var nodes = [];
  var links = [];
  for (let i = 0;i<chat.length; i++) {
    nodes.push(chat[i]);
    $(chat[i]).find('a').each(function() {
      links.push($(this).attr('href'));
    });
  }
  return [nodes,links];
}

function scrapeGmail(){
  var nodes = [];
  var links = [];
  $('.adn').find('a').each(function() {
    nodes.push(this);
    links.push($(this).attr('href'));
  });
  return [nodes,links];
}
function scrapeFbMini(){
  var parents = $("._d97");
  var nodes = [];
  var links = [];
  for(var i=0;i<parents.length;i++){
    $(parents[i]).find("a").each(function() {
      nodes.push(this);
      links.push($(this).attr('href'));
    });
  }
  return [nodes,links];
}
// safe index
const index = {
  "mail.google.com" : scrapeGmail,
  "https://www.facebook.com/messages/t/": scrapeFacebookMessanger,
  "https://www.facebook.com": scrapeFbMini
}
// Icon inserting function
function markBadLinks(resp){
  if (resp && resp.data) {
    console.log("DATA:", resp);
    // this could be optimized, but it doesn't really matter in the scheme of things.
    resp.data.forEach(link => {
      console.log($('a[href="' + link + '"]').length)
      $('a[href="' + link + '"]').css("outline", "1px solid  #cc0033");
    });
  }
}

// main function
function main(){
  if(!wait){
    var k = Object.keys(index);
    for(var i=0;i<k.length;i++){
      if(window.location.href.toString().search(k[i]) > -1){
        var data = index[k[i]]();
        if (!data) {
          return;
        }

        var nodes = data[0];
        var links = data[1];
        chrome.runtime.sendMessage({
          "links":links,
          "data":''
        },function(res){
          if(res === null){
            console.log("RESULT FAILURE");
            //alert("An error occurred in background.js");
          } else {
            console.log(res)
            markBadLinks(res);
          }
        })
      }
    }
    // throttling
    wait = true;
    setTimeout(function(){
      wait=false;
    },1000);
  }
}

// onload
$(document).ready(function(){
  $('head').append('<style>.e123456789::after {content: "x";}</style>');
  main();
});
$(document).bind('DOMSubtreeModified', function () {
  main();
});
