// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request = require('request');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

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

	.post(function(req, res) {
		let count = req.links.length;
		req.links.forEach((link, i) => {
			getIpAddress(link, (ipAddr) => {
				genStatusArray(ipAddr, i)
			});
		});
		res.json({ message: "Success!"});
	})

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server running on port ' + port);

function getIpAddress(origurl) {
	const options = {  
	    url: origurl,
	    method: 'HEAD',
	    headers: {
	        'Accept': 'application/json',
	        'Accept-Charset': 'utf-8',
	        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.16 (KHTML, like Gecko) Chrome/24.0.1304.0 Safari/537.16'
	    }
	}
	var x = 
	request(options, function (err, res, body) {
		if (res.headers.refresh !== 'undefined') {
			console.log(res.headers.refresh);
		}
	const dns_options = {family: 4, hints: dns.ADDRCONFIG | dns.V4MAPPED,};
			dns.lookup(options, dns_options, (err, address, family) =>
  			return address;

	
	});
}