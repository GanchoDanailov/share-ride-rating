exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.postLogin = function(req, res) {
    //res.redirect('/profile');
    //uncoment for ajax requests only
    // res.send("successful registration as:" + req.user.local.email);
    // var sess = req.session;
    // sess.email = req.body.email;
    // console.log(sess.email);
    res.end("done")
};


exports.profile = function(req, res) {
  console.log(req.user)
  //res.json(req.session);
    // res.render('profile.ejs', {
    //     user: req.user
    // });

    res.json(req.user);
    // var sess = req.session;
    // sess.email = req.body.email;
    // console.log(sess.email);
};

exports.postSignup = function(req, res) {
    res.end("done")
    //res.redirect('/profile');
};

exports.forgot = function(req, res) {
    res.render('forgot', {
        user: req.user
    });
};



var async = require('async');
var crypto = require('crypto');
var User = require('../../app/models/user');
var nodemailer = require('nodemailer');

exports.postForgot = function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({
                'local.email': req.body.email
            }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    //console.log('No account with that email address exists.')
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: 'ganchodanailov',
                    pass: 'gogo9102115586'
                }
            });
            var mailOptions = {
                to: user.local.email,
                from: 'x.list.4.20@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    //console.log(error);
                } else {
                    //console.log('Message sent: ' + info.response);
                    res.redirect('/forgot');
                }
            });
        }
    ]);
}

exports.getResetToken = function(req, res) {
    //console.log("from get: " + req.params.token);
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.user
        });
    });
}

exports.postResetToken = function(req, res) {
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
        }]);
};
