//Database configuration
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

// export the mongoose variable so when this file is required they will have mongoose configured and get it back
module.exports = {mongoose};
