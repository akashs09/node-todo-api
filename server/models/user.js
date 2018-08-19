var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
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

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); //actual data we want to sign is the userId which is unique on this collection
  user.tokens = user.tokens.concat({access, token});
  return user.save().then(() => {
    return token;
  })
} //instance methods have access to the individuals documents

var User = mongoose.model('User', UserSchema);

module.exports = {User}
