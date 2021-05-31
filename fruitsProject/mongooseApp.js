const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/peopleDb', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connection is successful');

	const peopleSchema = new mongoose.Schema({
		name: { type: String, required: true },
		age: Number
	});

	const peopleCol = mongoose.model('people', peopleSchema);

	//insering one doc

	// const peopleData = new peopleCol({
	// 	name: 'Nittin',
	// 	age: 22
	// });

	// peopleData.save().then((peopleDoc) => {
	// 	console.log('people doc saved');
	// 	db.close();
	// });

	//inserting many docs

	/*const peopleArr = [ { name: 'Berlin', age: 30 }, { name: 'Ananth', age: 31 }, { name: 'Sibi', age: 27 } ];

	peopleCol.insertMany(peopleArr, (err) => {
		if (err) console.log(err);
		else{
			console.log('Success in adding all docs');
			db.close();
		} 
	});*/

	// deleting entries
	// peopleCol.deleteOne({ name: 'Sam' }, (err) => {
	// 	if (err) console.log(err);
	// 	else console.log('record deleted');
	// });

	peopleCol.find({}, (err, docs) => {
		if (err) console.log(err);
		else {
			docs.forEach((doc) => {
				console.log(doc.name);
			});
			db.close();
		}
	});
});
