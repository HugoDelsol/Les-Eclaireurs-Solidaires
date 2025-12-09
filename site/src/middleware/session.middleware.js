
const checkAuth = (req, res, next) => {
    
    return req.session && req.session.userExist && req.session.userExist.id;
}

const requireAuth = (req, res, next) => {

    if (!checkAuth(req, res, next)) {

        return res.redirect('/signIn');
    }

    next()
}

const logout = (req, res, next) => {

    req.session.destroy((err) => {

        res.redirect('/');
    })
}


module.exports = {
    checkAuth,
    requireAuth,
    logout,
}