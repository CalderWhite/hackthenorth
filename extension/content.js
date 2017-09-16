// this code runs on every page opened
function scrapeFacebookMessanger(){
  var messages = [];
  var chat = document.getElementsByClassName("_aok");
  // find the messages not from the current user.
  var last = true;
  for (var i = 0;i<chat.length; i++) {
    if(chat[i].parentElement.dataset.tooltipPosition === "left"){
      if(last){
        messages.push([chat[i].textContent]);
      } else{
        messages[messages.length-1].push(chat[i].textContent);
      }
      last = false;
    } else{
      last = true;
    }
  };
  return {"messages":messages};
}
function scrapeGmail(){
  const from = document.getElementsByClassName("gD")[0].dataset.hovercardId;
  const subject = document.getElementsByClassName("hP")[0].textContent;
  const content = document.getElementById(":ey").textContent;
  const pkg = {
    "from" : from,
    "subject" : subject,
    "messages" : [content]
  }
  return pkg
}

console.log("Hello World from content.")