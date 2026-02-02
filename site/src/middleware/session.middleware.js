const { header } = require('express-validator');
const url = require('url')

const checkAuth = (req, res, next) => {

    return req.session && req.session.userExist && req.session.userExist.id;
}

const requireAuth = (req, res, next) => {

    if (!checkAuth(req, res, next)) {

        return res.redirect('/signIn');
    }

    next();
}

const volunteerAuthorization = (req, res, next) => {

    if (!req.session.userExist.isVolunteer) {

        return res.redirect('/signIn');
    }

    next();
}

const superAdminAuthorization = (req, res, next) => {

    if (!req.session.userExist.isSuperAdmin) {

        return res.redirect('/signIn');
    }

    next();
}

const allAdministratorAuthorization = (req, res, next) => {

    if (!req.session.userExist.isAdmin && !req.session.userExist.isSuperAdmin) {

        return res.redirect('/signIn');
    }

    next();
}

const logout = (req, res, next) => {

    

    req.session.destroy((err) => {        
        res.redirect('/')
    })
}

module.exports = {
    checkAuth,
    requireAuth,
    logout,
    volunteerAuthorization,
    superAdminAuthorization,
    allAdministratorAuthorization,
}