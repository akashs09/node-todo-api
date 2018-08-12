const mongoose = require('mongoose');


let User = mongoose.model('User', {
  email: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  }
});

module.export = {User};
