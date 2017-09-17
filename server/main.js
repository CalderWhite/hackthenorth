// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request 	 = require('request');
const dns 		 = require('dns');


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

function getSiteRatings(req, res) {
	let total = req.links.length,
			count = 0
			ret = [];
	req.links.forEach((link, i) => {
		getIpAddress(link, (ipAddr) => {
			genStatusArray(ipAddr, i);
		});
	});

	function genStatusArray(ipAddr, i) {
		if (!ipAddr) {
			ret[i] = false;
			if (++count === total) {
    		res.json({ data: ret });
    	}
		} else {
			request.get(`https://api.cymon.io/v2/ioc/search/ip/${ipAddr}`)
	  		.on('response', function(response) {
	    	 	if (response && response.statusCode === 200) {
	    	 		console.log(response);
	  	 			ret[i] = isABadLink(response.body) ? true : false;
	    	 	} else {
	    	 		ret[i] = false;
	    	 	}
	    		console.log(response.headers['content-type']) // 'image/png'
	    		if (++count === total) {
	    				res.json({ data: ret });
	    		}
	  		});
	  }
	}
}

function isMalLink(cymonResponse) {
	return false;
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
		if (res.headers.refresh !== 'undefined') {
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