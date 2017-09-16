const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

router.get('/', function(req, res) {
    res.json({ message: 'test req.' });   
});

app.use('/api', router);

router.route('/nutritionVals')
	.post((req, res) => {
		console.log(req.body);
		res.json({ success: true });
	});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);