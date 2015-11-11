exports.checkPermission = function (asl, resource, action, next) {
    var middleware = false; // start out assuming this is not a middleware call

    return function(req, res, next) {
        // check if this is a middleware call
        if (next) {
            // only middleware calls would have the "next" argument
            middleware = true;
        }

        var uid = mongoose.Types.ObjectId(req.session.passport.user).toString(); // get user id property from express request

        acl.isAllowed(uid, resource, action, function(err, res) {
            // return results in the appropriate way
            console.log('before is switch');
            switch (middleware) {
                case true:
                    if (res) {
                        // user has access rights, proceed to allow access to the route
                        next();
                    } else {
                        // user access denied
                        var checkError = new Error("user does not have permission to perform this action on this resource");
                        next(checkError); // stop access to route
                    }
                    return;
                    break;
                case false:
                    if (res) {
                        // user has access rights
                        return true;
                    } else {
                        // user access denied
                        return false;
                    }
                    break;
            }
        });
    }
};
