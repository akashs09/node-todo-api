var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: { //_ meaning object ID
    type: mongoose.Schema.Types.ObjectId, //type is objectId
    required: true //need to have valid ID therefore need to be logged in
  }
});

module.exports = {Todo};
