var mongoose = require('mongoose');
var async = require('async');
var Driver = require('../../app/models/drivers');

exports.getDrivers = function(req, res) {
    //uncoment for ajax requests only
    //res.send("successful registration as:" + req.user.local.email);
    //var sess = req.session;
    //sess.email = req.body.email;
    //console.log(sess.email);
    //res.end("done")

           // use mongoose to get all driver in the database
           Driver.find(function(err, drivers) {

               // if there is an error retrieving, send the error.
                               // nothing after res.send(err) will execute
               if (err)
                   res.send(err);

               res.json(drivers); // return all driver in JSON format
           });

};

exports.postDriver = function(req, res) {

    async.waterfall([
        function(done) {
            Driver.findOne({
                'driverName': req.body.driverName
            }, function(err, driver) {
              // if there are any errors, return the error
              if (err)
                  return done(err);

                if (driver) {
                    console.log("There is another driver with same name!");
                    res.end("There is another driver with same name!");
                }else{
                  // create the driver
                  var newDriver            = new Driver();
                  //console.log(req.body);
                  newDriver.driverName    = req.body.driverName;
                  newDriver.save(function(err) {
                      if (err)
                          return done(err);

                      return done(null, newDriver);
                  });
                }
            });
            res.end("done")
                //res.redirect('/login');
        }
    ]);
}


// User.findOne({ 'local.email' :  email }, function(err, user) {
//     // if there are any errors, return the error
//     if (err)
//         return done(err);
//
//     // check to see if theres already a user with that email
//     if (user) {
//         return done('That email is already taken.');
//     } else {
//
//         // create the user
//         var newUser            = new User();
//         //console.log(req.body);
//         newUser.local.email    = email;
//         newUser.local.password = newUser.generateHash(password);
//         newUser.local.name           = req.body.name;
//         newUser.local.birthday       = req.body.birthday;
//         newUser.local.country        = req.body.country;
//         newUser.local.city           = req.body.city;
//         newUser.local.gender         = req.body.gender;
//         newUser.save(function(err) {
//             if (err)
//                 return done(err);
//
//             return done(null, newUser);
//         });
//     }
//
// });
