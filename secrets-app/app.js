require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
/*const encrypt = require('mongoose-encryption');
const md5 = require('md5');
const bcrypt = require('bcrypt');*/

const app = express();
const port = process.env.PORT || 3100;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true
	})
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://' + process.env.DB_DOMAIN + '/' + process.env.DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', (err) => {
	console.log(error);
});
db.once('open', () => {
	console.log('db connected');
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: String
});

userSchema.plugin(passportLocalMongoose);

//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: [ 'password' ] });

const UserColl = new mongoose.model('User', userSchema);

passport.use(UserColl.createStrategy());
passport.serializeUser(UserColl.serializeUser());
passport.deserializeUser(UserColl.deserializeUser());

app.route('/').get((req, res) => {
	res.render('home');
});

app
	.route('/register')
	.get((req, res) => {
		res.render('register');
	})
	.post((req, res) => {
		//const newUser = new UserColl({ username: req.body.username, password: md5(req.body.password) });
		/*bcrypt.hash(req.body.password, 10, (err, hashedPwd) => {
			if (err) res.send('an error occurred: ' + err);
			else {
				const newUser = new UserColl({ username: req.body.username, password: hashedPwd });
				newUser.save((err) => {
					if (err) console.log(err);
					else res.render('secrets');
				});
			}
		});*/
		UserColl.register({ username: req.body.username }, req.body.password, (err, user) => {
			if (err) res.send(err);
			else {
				passport.authenticate('local')(req, res, () => {
					res.redirect('/secrets');
				});
			}
		});
	});

app
	.route('/login')
	.get((req, res) => {
		res.render('login');
	})
	.post((req, res) => {
		/*UserColl.findOne({ username: req.body.username }, (err, doc) => {
			if (err) console.log(err);
			else {
				if (doc) {
					//if (doc.password == md5(req.body.password)) res.render('secrets');
					bcrypt.compare(req.body.password, doc.password, function(err, result) {
						if (err) res.send('an error occured: ' + err);
						else if (result == true) res.render('secrets');
						else if (result == false) res.send('Incorrect username or password');
					});
				}
			}
		});*/

		const loggedUser = new UserColl({ username: req.body.username, password: req.body.password });

		req.login(loggedUser, (err) => {
			if (err) res.send(err);
			else {
				passport.authenticate('local')(req, res, () => {
					res.redirect('/secrets');
				});
			}
		});
	});

app.route('/secrets').get((req, res) => {
	if (req.isAuthenticated()) res.render('secrets');
	else res.redirect('/login');
});

app.route('/logout').get((req, res) => {
	req.logout();
	res.redirect('/');
});

app.listen(port, () => {
	console.log('server started at port ' + port);
});
