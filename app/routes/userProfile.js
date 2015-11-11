var mongoose = require('mongoose');
var Grid    = require('../../node_modules/gridfs-stream');
var User = require('../../app/models/user');
Grid.mongo = mongoose.mongo;
var gfs = new Grid(mongoose.connection.db);


exports.addUserAvatar = function(req, res) {
    //console.log("from post: " + req.params.token);
    async.waterfall([
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    //console.log("Password reset token is invalid or has expired");
                    return res.redirect('back');
                }

                user.local.password = user.generateHash(req.body.password);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    req.logIn(user, function(err) {
                        done(err, user);
                    });
                });
            });
            res.end("done")
                //res.redirect('/login');
        }
    ]);
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
