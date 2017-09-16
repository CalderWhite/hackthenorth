(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

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

},{}]},{},[1]);
