
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //object destructuring

//remember ObjectID is not a string but an object

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },  (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  db.collection('Todos').find().countDocuments({text: 'Something to do'}).then((count) => { //get the docs, turning them into an array and print to screen
    console.log('Todos');

    console.log(`Todos count: ${count}`);
  }, (err) =>  {
    console.log('Unable to fetch todos', err);
  });
  client.close();
});
