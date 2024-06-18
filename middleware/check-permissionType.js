function isAdmin(req, res, next) {
    if (req.userData.userType == 'Admin') {
        next()
    } else {
        res.status(403).json({
            message: 'Permission not allowed',
        })
    }
}

module.exports = {
    isAdmin,
}
