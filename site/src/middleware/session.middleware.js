
const checkAuth = (req, res, next) => {

    return req.session && req.session.userExist && req.session.userExist.id;
}

const requireAuth = (req, res, next) => {

    if (!checkAuth(req, res, next)) {

        return res.redirect('/signIn');
    }

    next()
}

const sessionUser = (req, res, next) => {

    if (req.session.userExist) {

        console.log('---->>>', req.session.userExist);
    }

    next();
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
    sessionUser,

}