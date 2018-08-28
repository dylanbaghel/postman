const GoogleStrategy = require('passport-google-oauth20').Strategy;


//CUSTOM MODULE FILES
const keys = require('./keys');
const { User } = require('./../models/User');

const passportGoogle = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
        

        //CHECK FOR EXISTING USER
        User.findOne({
            googleID: profile.id
        }).then((user) => {
            if(user) {
                done(null, user);
            } else {
                //CREATE USER
                let user = new User({
                    googleID: profile.id,
                    email: profile.emails[0].value,
                    displayName: profile.displayName,
                    image: image
                });

                user.save().then((user) => {
                    done(null, user);
                })
            }
        })

    }))

    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
};

module.exports = { passportGoogle };