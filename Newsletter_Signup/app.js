const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
var port = process.env.PORT || 3100;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/signup.html');
});

app.use(express.static(__dirname + '/public'));

app.post('/', (req, res) => {
	const data = {
		members: [
			{
				email_address: req.body.email,
				status: 'subscribed',
				merge_fields: {
					FNAME: req.body.firstName,
					LNAME: req.body.lastName
				}
			}
		]
	};

	const jsonData = JSON.stringify(data);
	const url = 'https://us1.api.mailchimp.com/3.0/lists/5cb64a38e2';
	const options = {
		method: 'POST',
		auth: 'key:59ef55c1df559909be33523d0fc2fb64-us1'
	};

	const request = https.request(url, options, (api_response) => {
		api_response.on('data', (data) => {
			console.log(JSON.parse(data));
		});
		console.log(api_response.statusCode);
		if (api_response.statusCode == 200) {
			res.sendFile(__dirname + '/success.html');
		} else {
			res.sendFile(__dirname + '/failure.html');
		}
	});

	request.write(jsonData);
	request.end();
});

app.post('/fail', (req, res) => {
	res.redirect('/');
});

app.listen(port, () => {
	console.log('server listening at ' + port);
});
