const mongoose = require('mongoose')
const User = require('./../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function Signup(req, res, next) {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user.length > 0) {
                return res.status(409).json({
                    message: 'Email Already Exist',
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            err: err,
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                        })
                            .save()
                            .then((result) => {
                                res.status(201).json({
                                    message:
                                        'Account Succesfully Created Created',
                                })
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    error: err,
                                })
                            })
                    }
                })
            }
        })
}

function deleteUser(req, res, next) {
    User.findByIdAndDelete(req.params.userId)
        .exec()
        .then((result) => {
            res.status(200).json({
                error: err,
            })
        })
}

// function Login(req, res) {
//     User.findOne({ email: req.body.email }) // Find a single user by email
//         .then((user) => {
//             if (!user) {
//                 // Check for user existence using falsy check
//                 return res.status(401).json({ message: 'User does not exist' })
//             }

//             bcrypt.compare(req.body.password, user.password, (err, result) => {
//                 if (err) {
//                     // Handle errors from bcrypt.compare
//                     console.error('Error comparing passwords:', err)
//                     return res
//                         .status(500)
//                         .json({ message: 'Internal server error' }) // Generic error for security
//                 }

//                 if (result) {
//                     // Use result directly for successful comparison
//                     return res.status(200).json({ message: 'Auth successful' })
//                 }

//                 res.status(401).json({ message: 'Auth failed' }) // Unauthorized on failed comparison
//             })
//         })
//         .catch((err) => {
//             // Handle errors from database operations
//             console.error('Error fetching user:', err)
//             res.status(500).json({ message: 'Internal server error' }) // Generic error for security
//         })
// }

function Login(req, res) {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'User does not exist',
                })
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Auth failed',
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user.id,
                            userType: user.user_type,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h',
                        }
                    )
                    return res.status(200).json({
                        message: 'Auth Succesfull',
                        token: token,
                    })
                }
                return res.status(401).json({ message: 'Auth failed' })
            })
        })
        .catch((err) => {
            // Handle errors from database operations
            console.error('Error fetching user:', err)
            res.status(500).json({ message: 'Internal server error' }) // Generic error for security
        })
}

module.exports = {
    Signup,
    deleteUser,
    Login,
}
