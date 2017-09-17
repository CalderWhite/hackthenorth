// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request 	 = require('request');
const dns 		 = require('dns');
var token;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
const dns_options = {family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

router.route('/')
	.post(getSiteRatings);

router.route('/report')
	.post(genReport);

function genReport() {
	var body = [];
	input.forEach(report => {
		body.push({
			feed_id: 'AV6Ose5vdgijOqSiMyIp',
			title: report.title,
			description: report.description,
			tags: ['malware'],
			ioc: {'url': report.url}
		})
	})
		request({
  			method: 'POST',
  			url: 'https://api.cymon.io/v2/ioc/submit/bulk',
  			headers: {
    				'Content-Type': 'application/json',
    				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19wcmVtaXVtIjowLCJpc19zdXBlcnVzZXIiOjAsImRhdGVfam9pbmVkIjoiMjAxNy0wOS0xN1QwNToxNDo1OC43NDBaIiwidXNlcm5hbWUiOiJodG4yMDE3IiwiaXNfYWN0aXZlIjoxLCJsYXN0X2xvZ2luIjoiMjAxNy0wOS0xN1QwNjozOTo0Ni41MzdaIiwiaXNfc3RhZmYiOjAsImlhdCI6MTUwNTYzMjQ1OSwiZXhwIjoxNTA1Njc1NjU5fQ.pWnbCNqUBcfFc5KmjbPfp5FBatDhFZUqaf2vfEJ6z2Q'
  					},
  			body: body
			},
			function (error, response, body) {
  				console.log('Status:', response.statusCode);
  				console.log('Headers:', JSON.stringify(response.headers));
  				console.log('Response:', response.body);
			});}

request({
  method: 'POST',
  url: 'https://api.cymon.io/v2/auth/login',
  headers: {
    'Content-Type': 'application/json'
  },
  body: "{  \"username\": \"htn2017\",  \"password\": \"hackthenorth\"}"
}, function (error, response, body) {
  console.log('Status:', response.statusCode);
  console.log('Headers:', JSON.stringify(response.headers));
  console.log('Response:', response.body);
  token = JSON.parse(response.body).jwt;
  console.log(token);
});


function getSiteRatings(req, res) {
	if(req.body.links == undefined){return}
	let total = req.body.links.length,
			count = 0
			ret = {};
	req.body.links.forEach((link) => {
		getIpAddress(link, (ipAddr) => {
			genStatusObj(ipAddr);
		});
	});

	function genStatusArray(ipAddr) {
		if (!ipAddr) {
			if (++count === total) {
    		res.json({ data: ret });
    	}
		} else {
			request.get(`https://api.cymon.io/v2/ioc/search/ip/${ipAddr}`,
				{'auth': {'bearer': token}}, function(err, response, body) {
	    	 	if (response && response.statusCode === 200) {
	    	 		console.log(response);
	  	 			if (isMalLink(body)) {
							ret[ipAddr] = '';
	  	 			}
	  	 			console.log('Link works');
	    	 	} else {
	    	 		console.log('Link does not work');
	    	 	}
	    		if (++count === total) {
	    				res.json({ data: ret });
	    		}
	  		});
	  }
	}
}

function isMalLink(cymonResponse) {
	console.log(cymonResponse);
	return cymonResponse.total > 0;
}

function getIpAddress(origurl, callback) {
	const options = {  
	    url: origurl,
	    method: 'HEAD',
	    headers: {
	        'Accept': 'application/json',
	        'Accept-Charset': 'utf-8',
	        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.16 (KHTML, like Gecko) Chrome/24.0.1304.0 Safari/537.16'
	    }
	}
	request(options, function (err, res, body) {
		if (err) {
			callback(null);
		}
		let finalAddress = origurl;
		if (res.headers.refresh !== undefined) {
			let urlStart = res.headers.refresh.indexOf('URL=') + 'URL='.length;
			finalAddress = res.headers.refresh.slice(urlStart);  
		}
		dns.lookup(finalAddress, dns_options, (err, address, family) => { callback(err ? null : address); });
	});
}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);
