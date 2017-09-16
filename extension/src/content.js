// this code runs on every page opened
function scrapeFacebookMessanger() {
  var messages = [];
  var chat = document.getElementsByClassName("_aok");
  // find the messages not from the current user.
  var last = true;
  for (var i = 0; i < chat.length; i++) {
    if (chat[i].parentElement.dataset.tooltipPosition === "left") {
      if (last) {
        messages.push([chat[i].textContent]);
      } else {
        messages[messages.length - 1].push(chat[i].textContent);
      }
      last = false;
    } else {
      last = true;
    }
  };
  return { "messages": messages };
}
function scrapeGmail() {
  var exp = /#inbox\/[a-zA-Z0-9]+/;
  // check to see that they are in fact viewing an email, not just at their inbox
  if (window.location.href.toString().match(exp) == null) {
    return;
  }
  // grab the data
  var from = document.getElementsByClassName("gD")[0].dataset.hovercardId;
  var subject = document.getElementsByClassName("hP")[0].textContent;
  var content = document.getElementsByClassName("aXjCH").textContent;
  var pkg = {
    "from": from,
    "subject": subject,
    "messages": [content]
  };
  return pkg;
}
var index = {
  "mail.google.com": "test"
};
console.log("Hello World from content.");
