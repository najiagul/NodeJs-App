const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User model
const User = require('../models/User')

// Login page
router.get('/login', (req, res) => {
    res.render('login')
})

// Login post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
    }) (req, res, next);
})

// Register page
router.get('/register', (req, res) => {
    res.render('register')
})

// Register post
router.post('/register', (req, res) => {
    console.log(req.body)
    //res.send('helloww')
    const { name, email, password, password2} = req.body
    errors = []

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields"})
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg : 'Passwords do not match'})
    }

    // Check length of password is greater than 6
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'})
    }

    if (errors.length >= 1) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else {
        // User validated
        User.findOne( {email: email})
        .then(user => {
            if (user) {
                errors.push({msg: 'This email is already registered'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password
                })
                // Hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if (err) throw err;
                        // Set password to hashed password
                        newUser.password = hash
                        // Save user
                        newUser.save()
                        .then( user => {
                            req.flash('success_msg', 'You have been registered')
                            res.redirect('/users/login')
                        })
                        .catch()
                    })
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
})

// Logout handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})
module.exports = router 