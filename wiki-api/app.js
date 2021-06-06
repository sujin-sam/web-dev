const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3100;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
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

const wikiSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
});

const WikiCol = new mongoose.model('article', wikiSchema);

app
	.route('/articles')
	.get((req, res) => {
		WikiCol.find({}, (err, articles) => {
			if (err) res.send(err);
			else res.send(articles);
		});
	})
	.post((req, res) => {
		const article = new WikiCol({ title: req.body.title, content: req.body.content });
		article.save((err) => {
			if (err) res.send(err);
			else res.send('article: ' + req.body.title + ' saved');
		});
	})
	.delete((req, res) => {
		WikiCol.deleteMany({}, (err) => {
			if (err) res.send(err);
			else res.send('deleted all articles');
		});
	});

app
	.route('/articles/:article')
	.get((req, res) => {
		WikiCol.findOne({ title: req.params.article }, (err, doc) => {
			if (err) res.send(err);
			else {
				if (!doc) res.send('article:' + req.params.article + ' not found');
				else res.send(doc);
			}
		});
	})
	.put((req, res) => {
		WikiCol.updateOne(
			{ title: req.params.article },
			{ title: req.body.title, content: req.body.content },
			{ strict: true },
			(err, mongoRes) => {
				if (err) res.send(err);
				else {
					if (mongoRes.nModified > 0) res.send('article of ' + req.params.article + ' updated');
					else if (mongoRes.n == 0) res.send('article ' + req.params.article + ' not found');
					else res.send('article ' + req.params.article + ' not modified');
				}
			}
		);
	})
	.patch((req, res) => {
		WikiCol.updateOne({ title: req.params.article }, { $set: req.body }, (err, mongoRes) => {
			if (err) res.send(err);
			else {
				if (mongoRes.nModified > 0) res.send('article: ' + req.params.article + ' updated');
				else if (mongoRes.n == 0) res.send('article: ' + req.params.article + ' not found');
				else res.send('article: ' + req.params.article + ' not modified');
			}
		});
	})
	.delete((req, res) => {
		WikiCol.deleteOne({ title: req.params.article }, (err) => {
			if (err) res.send(err);
			else res.send('article: ' + req.params.article + ' deleted');
		});
	});

app.listen(port, () => {
	console.log('Server started at port ' + port);
});
