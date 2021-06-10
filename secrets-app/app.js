require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
const port = process.env.PORT || 3100;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://' + process.env.DB_DOMAIN + '/' + process.env.DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', (err) => {
	console.log(error);
});
db.once('open', () => {
	console.log('db connected');
});

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: [ 'password' ] });

const UserColl = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
	res.render('home');
});

app
	.route('/register')
	.get((req, res) => {
		res.render('register');
	})
	.post((req, res) => {
		const newUser = new UserColl({ email: req.body.email, password: req.body.password });
		newUser.save((err) => {
			if (err) console.log(err);
			else res.render('secrets');
		});
	});

app
	.route('/login')
	.get((req, res) => {
		res.render('login');
	})
	.post((req, res) => {
		UserColl.findOne({ email: req.body.email }, (err, doc) => {
			if (err) console.log(err);
			else {
				if (doc) {
					if (doc.password == req.body.password) res.render('secrets');
					else res.send('Incorrect email or password');
				}
			}
		});
	});

app.listen(port, () => {
	console.log('server started at port ' + port);
});
