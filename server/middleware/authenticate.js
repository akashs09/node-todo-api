let {User} = require('./../models/user');

//did you sign up or login succesfully is the way to get x-auth token to make authenticated requests
let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });  //take the token value and find the appropriate user with the token and returning it inside of the promise callback
};

module.exports = {authenticate};
