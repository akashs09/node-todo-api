
// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //object destructuring

//remember ObjectID is not a string but an object

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },  (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5b6cf9ca6c4bfd24bde1110d')}).then((result) => {
    console.log(result);
  });
  client.close();
});
