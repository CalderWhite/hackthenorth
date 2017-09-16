// this code can run in the background, but is currently set to work with events.
// Google: chrome.runtime.onMessage.addListener

const ENDPOINT = 'https://api.cymon.io/v2';
const USERNAME = 'htn2017';
const PASSWD = 'hackthenorth';

let myHeaders = new Headers();

const authConfig = {
  method: 'POST',
  body: {
    username: USERNAME,
    password: PASSWD
  },
  headers: new Headers()
};

fetch(ENDPOINT + '/auth/login', authConfig)
	.then(resp => resp.json())
	.then(resp => {
		console.log(resp);
	});