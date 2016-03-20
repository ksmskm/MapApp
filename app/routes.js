var mongoose = require('mongoose');
var User = require('./model.js');

function routes(app) {  
  var verified_message = "Yep (Thanks for giving us real data!)";

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

  app.post('/query', function(req, res) {
    var lat = req.body.latitude;
    var long = req.body.longitude;
    var distance = req.body.distance;
    var male = req.body.male;
    var female = req.body.female;
    var other = req.body.other;
    var minAge = req.body.minAge;
    var maxAge = req.body.maxAge;
    var favlang = req.body.favlang;
    var reqVerified = req.body.reqVerified;

    var query = User.find({});

    if (distance) {
      query = query.where('location').near({
        center: {
          type: 'Point',
          coordinates: [long, lat]
        },
        maxDistance: distance * 1609.34,
        spherical: true
      });
    }

    if (male || female || other) {
      query.or([
        { 'gender': male },
        { 'gender': female },
        { 'gender': other }
      ]);
    }

    if (minAge) query = query.where('age').gte(minAge);
    if (maxAge) query = query.where('age').lte(maxAge);
    if (favlang) query = query.where('favlang').equals(favlang);
    if (reqVerified) query = query.where('htmlverified').equals(verified_message);

    query.exec(function(err, users) {
      if (err) res.send(err);
      res.json(users);
    });
  });

  // frontend routes =========================================================
  app.get('*', function(req, res) {
    res.sendfile('public/index.html');
  });  
}

module.exports = routes;
