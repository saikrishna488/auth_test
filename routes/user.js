const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//loading model
const User = require('../model/User')
const { Mongoose } = require('mongoose')

router.get('/login', (req, res) => {
    res.render("login")
})

router.get('/register', (req, res) => {
    res.render("register")
})

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    let errors = []

    //check fields
    if (!name || !password || !email) {
        errors.push({ msg: "Please fill All the fields" })
    }

    if (password.length < 6) {
        errors.push({ msg: "Password should be atleast 6 characters" })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password
        })
    }
    else {
        //validation passed
        User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    errors.push({ msg: "email already registered" })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password
                    })
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            //storing hash pass
                            newUser.password = hash
                            //save user to db
                            newUser.save()
                                .then((user) => {
                                    req.flash('success_msg', "You are now registered and can log in")
                                    res.redirect('/user/login')
                                }).catch((err) => console.log(err))
                        })
                    })
                }

            })
    }
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login',failureFlash: true }), (req, res) => {
    res.redirect('../dashboard')
});

router.get('/logout', (req, res) => {

    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out')
        res.redirect('/user/login')
    });

});


module.exports = router