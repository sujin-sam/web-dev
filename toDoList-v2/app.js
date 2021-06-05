const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://admin:manuRooney10@cluster0.uceac.mongodb.net/todolistDB?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', (err) => {
	console.log(err);
});
db.once('open', () => {
	console.log('db connected');
});

const itemSchema = new mongoose.Schema({
	item: {
		type: String,
		required: true
	}
});

const ItemCol = mongoose.model('item', itemSchema);

const baseItem = new ItemCol({ item: 'Look into mails' });

const listSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	items: [ itemSchema ]
});

const ListCol = mongoose.model('list', listSchema);

app.get('/', (req, res) => {
	let day = date.getDate();

	ItemCol.find({}, (err, docs) => {
		if (err) console.log(err);
		else {
			if (docs.length == 0) {
				baseItem.save((err) => {
					if (err) console.log(err);
				});
				res.redirect('/');
			} else {
				res.render('list', { listTitle: day, newListItems: docs });
			}
		}
	});
});

app.post('/', (req, res) => {
	let day = date.getDate();
	let newItem = new ItemCol({ item: req.body.newItem });

	if (req.body.list === day) {
		newItem.save((err) => {
			if (err) console.log(err);
			else res.redirect('/');
		});
	} else {
		ListCol.findOne({ name: req.body.list }, (err, doc) => {
			if (err) console.log(err);
			else {
				doc.items.push(newItem);
				doc.save();
				res.redirect('/' + req.body.list);
			}
		});
	}
});

app.post('/delete', (req, res) => {
	let day = date.getDate();
	if (req.body.listName === day) {
		ItemCol.findByIdAndRemove({ _id: req.body.checkbox }, (err) => {
			if (err) console.log(err);
			else res.redirect('/');
		});
	} else {
		ListCol.findOneAndUpdate(
			{ name: req.body.listName },
			{ $pull: { items: { _id: req.body.checkbox } } },
			(err, doc) => {
				if (err) console.log(err);
				else {
					res.redirect('/' + req.body.listName);
				}
			}
		);
	}
});

app.get('/:list', (req, res) => {
	let listName = _.capitalize(req.params.list);
	ListCol.findOne({ name: listName }, (err, doc) => {
		if (err) console.log(err);
		else {
			if (!doc) {
				const listItem = new ListCol({ name: listName, items: baseItem });
				listItem.save((err) => {
					if (err) console.log(err);
					else res.redirect('/' + listName);
				});
			} else {
				res.render('list', { listTitle: doc.name, newListItems: doc.items });
			}
		}
	});
});

// app.get('/:list', (req, res) => {
// 	let listName = req.params.list;
// 	ListCol.find({ name: listName }, (err, docs) => {
// 		if (err) console.log(err);
// 		else {
// 			console.log(docs.length);
// 			if (docs.length == 0) {
// 				let listItem = new ListCol({ name: listName, items: baseItem });
// 				listItem.save((err) => {
// 					if (err) console.log(err);
// 					else {
// 						res.redirect('/' + listName);
// 					}
// 				});
// 			} else {
// 				res.render('list', { listTitle: docs[0].name, newListItems: docs[0].items });
// 			}
// 		}
// 	});
// });

app.get('/about', (req, res) => {
	res.render('about');
});

app.listen(3100, () => {
	console.log('Server started on port 3100');
});
