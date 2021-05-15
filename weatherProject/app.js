const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const port = 3100;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
	const url =
		'https://api.openweathermap.org/data/2.5/weather?q=' +
		req.body.city +
		'&appid=2443747ead6fa957ffc39af5bf8c581e&units=metric';
	https.get(url, (api_res) => {
		api_res.on('data', (data) => {
			const weatherData = JSON.parse(data);
			res.write('<h1>The temp in ' + req.body.city + ' is ' + weatherData.main.temp + 'deg Celsius</h1>');
			res.write('<p>' + req.body.city + ' experiences ' + weatherData.weather[0].description + '</p>');
			res.write('<img src="http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png">');
			res.send();
		});
	});
});

app.listen(port, () => {
	console.log('server started at localhost:' + port);
});
