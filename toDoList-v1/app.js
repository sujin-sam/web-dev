const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();
const port = process.env.PORT || 3100;
const items = [];
const workList = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('list', { listTitle: date.getDate(), itemList: items });
});

app.post('/', (req, res) => {
	items.push(req.body.toDo);
	res.redirect('/');
});

app.get('/work', (req, res) => {
	res.render('list', { listTitle: 'Work', itemList: workList });
});

app.post('/work', (req, res) => {
	workList.push(req.body.toDo);
	res.redirect('/work');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.listen(port, () => {
	console.log('server is running at ' + port);
});
