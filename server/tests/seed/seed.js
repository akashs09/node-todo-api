const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{ //array of users we add for seed data
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()       //for the data we sign
  }]
}, {        //first user has valid auth token
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}]; //second user has no auth token
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};
const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save(); //.save() runs middleware
    let userTwo = new User(users[1]).save(); //have two promises here and need to wait for all them to complete use PRmise.all
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};
module.exports = {todos, populateTodos, users, populateUsers};
