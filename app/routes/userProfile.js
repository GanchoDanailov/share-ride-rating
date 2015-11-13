var mongoose = require('mongoose');
var Grid = require('../../node_modules/gridfs-stream');
var User = require('../../app/models/user');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);
var fs = require('fs');

exports.addUserAvatar = function(req, res) {
  User.findOne({ _id: req.params.user_id }, function (err, user) {
    console.log(req.files.file);
      var part = req.files.file;
      var writeStream = gfs.createWriteStream({
          filename: part.name,
          mode: 'w',
          content_type:part.mimetype
      });

      writeStream.on('close', function(file) {
          user.avatarId = file._id;
          user.save(function (err, user) {
              if (!err) {
                  return res.status(200).send({
                      user_id: user._id,
                      file_id: file._id,
                      message: 'Success'
                  });
              } else {
                  console.log('Exception while updating user: ', err);
              }
          });


      });

      writeStream.write(part.data);

      writeStream.end();
  });
}

exports.getUserAvatar = function(req, res) {

  var user_id = mongoose.Types.ObjectId(req.session.passport.user);
  User.findOne({
    _id: user_id
  }, function(err, user) {
    gfs.files.findOne({
      _id: user.avatarId
    }, function(err, file) {

      res.writeHead(200, {
        'Content-Type': file.contentType
      });

      var readstream = gfs.createReadStream({
        _id: user.avatarId
      });

      readstream.on('data', function(data) {
        res.write(data);
      });

      readstream.on('end', function() {
        res.end();
      });

      readstream.on('error', function(err) {
        console.log('An error occurred!', err);
        throw err;
      });
    });
  });
}
