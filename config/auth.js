// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '100224643678158', // your App ID
        'clientSecret'    : '7c621147dac3617ede1e84eec9786fa5', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '965337704175-r5ep86tntlod1h7mmoembc0hpso8a0na.apps.googleusercontent.com',
        'clientSecret'     : 'jkHdyPZ9F7OEmlWWX53PBqhT',
        'callbackURL'      : 'http://127.0.0.1:8080/auth/google/callback'
    }

};
