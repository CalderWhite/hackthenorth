// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var firebase = require('./firebase.js');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request 	 = require('request');
const dns 		 = require('dns');
var token, currDate;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
const dns_options = {family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED};
var db = new firebase.Database();

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
	.post(report);

function report(req, res) {
	console.log("<<<<<<<<>>>>>>>>>>>")
	var count = 0;
	db.getDomain(req.body.url, (dbObject) => {
		if (dbObject.count === 4) {
			dbObject.desc.forEach((desc) => genReport(req.body.url, desc, res));
		} else {
			db.updateDomain(req.body.url, req.body.title);
			res.json({success: true});
		}
	});

	function genReport(url, desc, res) {
		var body = [];
		input.forEach(report => {
			body.push({
				feed_id: 'AV6Ose5vdgijOqSiMyIp',
				title: desc,
				description: desc,
				tags: ['malware'],
				ioc: {'url': url}
			})
		});
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
			if (++count === 5) {
				res.json({ success: true});
			}
		});
	}
}

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
	currDate = new Date();
	if(req.body.links === undefined) {
		res.json({ data: null });
		return;
	}
	let total = req.body.links.length,
			count = 0
			ret = [],
			descs = [];
	req.body.links.forEach((link) => {
		getIpAddress(link, genStatusObj);
	});

	function genStatusObj(ipAddr, origUrl) {
		if (!ipAddr) {
			if (++count === total) {
				console.log("RETURN: ", ret)
    		res.json({ data: ret, descs: descs });
    	}
		} else {
			let currYear = currDate.getFullYear();
			let month = currDate.getMonth();
			if (month.toString().length === 1) {
				month = '0' + (month-1);
			}
			let day = currDate.getDate();
			if (day.toString().length ===1) {
				day = '0'+ day;
			}
			let reqURL = `https://api.cymon.io/v2/ioc/search/ip/${ipAddr}?startDate=${currYear - 2}-${month}-${day}&endDate=${currYear}-${month}-${day}`;
			request.get(reqURL, { auth: {bearer: token}}, function(err, response, body) {
    	 	if (response && response.statusCode === 200) {
    	 		let data = JSON.parse(body);
  	 			if (isMalLink(data)) {
						ret.push(origUrl);
						if(data.hits && data.hits.length > 0) {
							descs.push(data.hits[0].title);
						} else {
							descs.push("");
						}

  	 			}
    	 	} else {
    	 		console.log(err);
    	 	}
    		if (++count === total) {
    				res.json({ data: ret, descs: descs });
    		}
  		});
	  }
	}
}

function isMalLink(cymonResponse) {
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
			return;
		}
		let finalAddress = origurl;
		if (res.headers.refresh !== undefined) {
			let urlStart = res.headers.refresh.indexOf('URL=') + 'URL='.length;
			finalAddress = res.headers.refresh.slice(urlStart);  
		}
		finalAddress = extractHostname(finalAddress);
		dns.lookup(finalAddress, dns_options, (err, address, family) => {
			if (err) {
				callback(null);
			} else {
				callback(address, origurl);
			}
		});
	});
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);
