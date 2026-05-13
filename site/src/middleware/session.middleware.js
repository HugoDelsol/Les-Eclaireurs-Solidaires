const { header } = require('express-validator');
const url = require('url');
const service = require('../services/services');

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
        res.clearCookie('tokenSession');
        res.redirect('/home');
    })
}

const sessionCookies = (req, res, next) => {

    if (!req.session.userExist) {
        return next();
    }
    
    let redirectPath = "/dashboardUser";
    if (req.session.userExist && req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {
        redirectPath = "/admin/dashboardAdmin";
    }

    const cookies = req.headers.cookie || "";
    const cookiesMap = {};

    cookies.split(';').forEach(element => {
        const [name, value] = element.split("=");
        cookiesMap[name.trim()] = value;
    });

    const idUser = req.session.userExist.id;
    const token = cookiesMap['tokenSession'];

    const isValid = service.verifyTokenSession(token, idUser);

    if (isValid) {
        return res.redirect(redirectPath);
    }

    next();
}

module.exports = {
    checkAuth,
    requireAuth,
    logout,
    volunteerAuthorization,
    superAdminAuthorization,
    allAdministratorAuthorization,
    sessionCookies,
}