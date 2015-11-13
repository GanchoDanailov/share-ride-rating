module.exports = function(app, passport, acl) {
    console.log('', acl);

    // normal routes ===============================================================
    var userAuth = require('./routes/userAuth');
    var userProfile = require('./routes/userProfile');
    var drivers = require('./routes/drivers');
    //var acl = require('./middlewares/aclMiddleware');

    // show the home page (will also have our login links)
    app.get('/index', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, userAuth.profile);

    // LOGOUT ==============================
    app.get('/logout', userAuth.logout);

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/profile', // redirect to the secure profile section
    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

    app.post('/login', passport.authenticate('local-login'), userAuth.postLogin);

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs');
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup'), userAuth.postSignup);


    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook'),
        function(req, res) {
            //console.log(req);
            console.log("done");
            res.send('done');
        });

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', {
        scope: 'email'
    }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', {
        scope: 'email'
    }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });



    // =============================================================================
    // RESET PASSWORD  =============================================================
    // =============================================================================
    app.get('/forgot', userAuth.forgot);

    app.post('/forgot', userAuth.postForgot);

    app.get('/reset/:token', userAuth.getResetToken);

    app.post('/reset/:token', userAuth.postResetToken);

    // =============================================================================
    // USER PROFILE   ==============================================================
    // =============================================================================

    var busboyBodyParser = require('../node_modules/busboy-body-parser');

    app.post('/avatar/:user_id', busboyBodyParser({
        limit: '5mb'
    }), userProfile.addUserAvatar);

    app.get('/avatar', isLoggedIn, userProfile.getUserAvatar);

    // =============================================================================
    // Drivers =====================================================================
    // =============================================================================
    app.get('/drivers',isLoggedIn, drivers.getDrivers);
    app.post('/driver',isLoggedIn, drivers.postDriver);

    // =============================================================================
    // ACL =========================================================================
    // =============================================================================

    app.get("/topsecret", acl.middleware(), function(req, res) {
        res.send("if you are reading this, you have proper clearance");
    });

    app.get('/nottopsecret', function (req, res) {
      acl.allow('guest', 'blogs', 'view');
      // console.log('after allow');
      // acl.addUserRoles('55ec99ade634419c6020cba3', 'guest');
      // console.log('after add roles');
    });


    var Post = require('../app/models/tasks');
    var Task = require('../app/models/tasks');
    app.get("/task", function(req, res) {

        // var post = new Post({
        //     title: "Hello World",
        //     postedBy: "55e86035bf5225110000a78c",
        //     comments: [{
        //         text: "Nice post!",
        //         postedBy: "55e860a4ce45136047a73890"
        //     }, {
        //         text: "Thanks :)",
        //         postedBy: "55e94241dc8d0388059cffa5"
        //     }]
        // })
        //
        // post.save(function(error) {
        //     console.log("lpr")
        //     if (!error) {
        //         Post.find({})
        //             .populate('postedBy')
        //             .populate('comments.postedBy')
        //             .exec(function(error, posts) {
        //
        //                 console.log(JSON.stringify(posts, null, "\t"))
        //             })
        //     }
        // });

        var task = new Task({
            title: "Hello World",
            taskAddedForUsers: ["55e86035bf5225110000a78c", "55e94241dc8d0388059cffa5"]
        })

        task.save(function(error) {
            console.log("lpr")
            if (!error) {
                Post.find({})
                    .populate('taskAddedForUsers')
                    .exec(function(error, posts) {

                        console.log(JSON.stringify(posts, null, "\t"))
                    })
            }
        });
    });




    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
