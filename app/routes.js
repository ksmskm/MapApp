var mongoose = require('mongoose');
var User = require('./model.js');

function routes(app) {
  app.get('/users', function(req, res) {
    var query = User.find({});
    query.exec(function(err, users) {
      if (err) res.send(err);
      res.json(users);
    });
  });

  app.post('/users', function(req, res) {
    var newuser = new User(req.body);

    newuser.save(function(err) {
      if (err) res.send(err);
      res.json(req.body);      
    });
  });
}

module.exports = routes;
