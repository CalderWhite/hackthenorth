// this code runs on every page opened
const $ = require('jquery');
var wait = false;
var tooltip;
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
    // this could be optimized, but it doesn't really matter in the scheme of things.
    resp.data.forEach((link, i) => {
      var links = $('a[href="' + link + '"]')
      links.css('color', '#cc0033');
      if (links.length < 1) return;
      links.each(function(index) {
        if (this.children.length < 1) {
          this.onmousemove = function(e) {
            console.log(tooltip.get());
            console.log(e)
            tooltip.css("left", e.screenX+10+"px");
            tooltip.css("top", e.screenY-150+"px");
            tooltip.css("display", "inline-block");
            tooltip.html(resp.descs[i+index]);
          }
          this.onmouseout = function() {
            tooltip.css("display", "none");
          }
          this.onmouseenter = function() {
            tooltip.css("display", "inline-block");
          }
          var x = document.createElement("img")
          x.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/White_X_in_red_background.svg/2000px-White_X_in_red_background.svg.png";
          x.style.height = "10px";
          x.style.width = "10px";
          x.style.marginLeft = "3px";
          x.style.marginRight = "3px";
          this.appendChild(x);
        }
      });
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
  main();
  tooltip = document.createElement('div');
  document.body.appendChild(tooltip);
  tooltip = $(tooltip).css('font-family', "Helvetica Neue, Helvetica, Arial, sans-serif")
    .css('position', 'absolute')
    .css('display', 'none')
    .css('width', 'auto')
    .css('height', 'auto')
    .css('background', 'none repeat scroll 0 0 white')
    .css('border', '0 none')
    .css('border-radius', '8px 8px 8px 8px')
    .css('box-shadow', '-3px 3px 15px #888888')
    .css('color', 'black')
    .css('font', '12px sans-serif')
    .css('padding', '5px')
    .css('z-index', 16777271)
    .css('text-align', 'center');
  chrome.runtime.sendMessage("sendmain", null, main)
});
$(document).bind('DOMSubtreeModified', function () {
  main();
});
