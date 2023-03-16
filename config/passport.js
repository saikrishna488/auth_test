const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//load user model
const User = require('../model/User')

module.exports = (passport) => {
    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Match user
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return (null, false, { message: "The email is not registered" })
                    }
                    //bcrypt
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err

                        if (isMatch) {
                            return done(null, user)
                        }
                        else {
                            return done(null, false, { message: "password incorrect" })
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function (user) {
            done(null, user);
        }).catch(function (err) {
            done(err, null, { message: 'User does not exist' });
        });
    });
}