const { MongoClient } = require('mongodb');
// Connection URI
const uri = 'mongodb://localhost:27017/';
// Create a new MongoClient
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

async function run() {
	try {
		// Connect the client to the server
		await client.connect();
		// Establish and verify connection
		const fruitsDb = await client.db('fruitsDB');
		await fruitsDb.command({ ping: 1 });
		console.log('Connected successfully to server');

		const fruits = await fruitsDb.collection('fruits');

		const fruitsDocuments = [
			{ name: 'Apple', score: '9', review: 'Awesome' },
			{ name: 'Orange', score: '7', review: 'Juicy at times' },
			{ name: 'Banana', score: '8', review: 'standard' }
		];

		const result = await fruits.insertMany(fruitsDocuments);
		console.dir(result.insertedCount);
		const findResult = await fruits.find();
		await findResult.forEach(console.dir);
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}
run().catch(console.dir);
