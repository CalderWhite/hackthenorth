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
function scrapeFbMini(){
  var parents = $("._d97");
  var nodes = [];
  var links = [];
  for(var i=0;i<parents.length;i++){
    var a = $(parents[i]).find("a").each(function() {
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
function markBadLinks(nodes,data){
  console.log(nodes,data);
  // this could be optimized, but it doesn't really matter in the scheme of things.
  for(var i=0;i<nodes.length;i++){
    if(!data[i]){
      nodes[i].className = "e123456789";
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
        chrome.runtime.sendMessage({
          "links":links,
          data:''
        },function(res){
          if(res === null){
            console.log(res);
            //alert("An error occurred in background.js");
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

console.log("Hello World.")
