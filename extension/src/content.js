// this code runs on every page opened
const $ = require('jquery');
var wait = false;

// scraping functions
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
  var nodes = [];
  var links = [];
  var tree = $.parseHTML("<div>"+dump+"</div>");
  $(tree).find('a').each(function() {
    nodes.push(this);
    links.push($(this).attr('href'));
  });
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

// safe index
const index = {
  "mail.google.com" : scrapeGmail,
  "https://www.facebook.com/messages/t/": scrapeFacebookMessanger
}
// Icon inserting function
function markBadLinks(nodes,data){
  console.log("test")
  console.log(nodes,data);
  // this could be optimized, but it doesn't really matter in the scheme of things.
  for(var i=0;i<nodes.length;i++){
    if(!data[i]){
      nodes[i].className = "e123456789"
    }
  }
}

// main function
function main(){
  if(!wait){
    var k = Object.keys(index);
    for(var i=0;i<k.length;i++){
      if(window.location.href.toString().search(k[i]) > -1){
        var data = index[k[i]]();
        var nodes = data[0];
        var links = data[1];
        console.log("running")
        chrome.runtime.sendMessage({
          "links":links,
          data:''
        },function(res){
          console.log(res)
          if(res == null){
            alert("An error occurred in background.js");
          } else{
            markBadLinks(nodes,res);
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
  $('head').append('<style>.e123456789::after {content: "x"}</style>')
});
$(document).bind('DOMSubtreeModified', function () {
  main();
});

console.log("Hello world")
