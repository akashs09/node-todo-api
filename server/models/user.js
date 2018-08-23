const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({ //lets you define a new schema to add on custom methods
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, //property email does not have any other document with same email
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email`
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  let user = this; //instance methods get called with the individual document
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); //actual data we want to sign is the userId which is unique on this collection
  user.tokens = user.tokens.concat([{access, token}]);
  return user.save().then(() => {
    return token;
  })
} //instance methods have access to the individuals documents

UserSchema.statics.findByToken= function (token) {
  let User = this //model methods get called with the 'this' binding
  let decoded;
  try {
    decoded = jwt.verify(token, 'abc123')
  } catch(e) {
    return new Promise((resolve, reject) => { //this promise will get returned by the findByToken caller
      reject();
    })
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}//using statics instead of methods bcuz everything you add onto it becomes model method not instance

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({email}).then((user) => { //chaining the promise
    if (!user) {
      return Promise.reject(); //the User.findByCredentials() in server.js is expecting a promise
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => { //bcrypt library only support callbacks not promises
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function(next) {
  let user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err,hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
var User = mongoose.model('User', UserSchema);

module.exports = {User}
