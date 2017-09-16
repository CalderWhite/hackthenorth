(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener

var ENDPOINT = 'https://api.cymon.io/v2';
var USERNAME = 'htn2017';
var PASSWD = 'hackthenorth';

var myHeaders = new Headers();

var authConfig = {
  method: 'POST',
  body: {
    username: USERNAME,
    password: PASSWD
  },
  headers: new Headers()
};

fetch(ENDPOINT + '/auth/login', authConfig);

},{}]},{},[1]);
