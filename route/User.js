const express = require('express')
const UserController = require('./../controller/User')
const router = express.Router()
const FacebookStrategy = require('passport-facebook')
const passport = require('passport')
const User = require('./../model/User')
passport.use(
    new FacebookStrategy(
        {
            clientID: 492879213076855,
            clientSecret: 'a372eafc08570a8e3216bf9708844553',
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
        },
        function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ facebookId: profile.id }, function (err, user) {
                return cb(err, user)
            })
        }
    )
)
router.get('/', passport.authenticate('facebook', { scope: 'email' }))
router.get(
    '/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
    function (req, res) {
        res.redirect('/products')
    }
)
router.post('/signup', UserController.Signup)
router.post('/delete', UserController.deleteUser)
router.post('/login', UserController.Login)
module.exports = router
