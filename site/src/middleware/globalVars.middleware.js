const centralizedVar = (req, res, next) => {

    // --- ALERT MESSAGE --- //
    res.locals.alertMsg = null;

    // --- MISSION --- //
    res.locals.regions = null;
    res.locals.missions = null;
    res.locals.missionsUser = null;
    res.locals.categoriesMission = null;
    res.locals.missionSelected = null;
    res.locals.categorySelected = null;
    res.locals.regionSelected = null;

    // --- SIGNUP PAGE --- //
    res.locals.firstName = null;
    res.locals.lastName = null;
    res.locals.email = null;
    res.locals.password = null;
    res.locals.passwordConfirm = null;
    
    // --- TOKEN --- //
    res.locals.token = null;
    res.locals.tokenAdmin = null;
    res.locals.tokenSuper = null;
    res.locals.superAdmins = null;
    res.locals.admins = null;

    next();
}

const userData = (req, res, next) => {

    if (req.session && req.session.userExist) {

        res.locals.idUser = req.session.userExist.id;
        res.locals.pseudoUser = req.session.userExist.firstName;
        res.locals.isAdmin = req.session.userExist.isAdmin;
        res.locals.isSuperAdmin = req.session.userExist.isSuperAdmin;

    } else {

        res.locals.idUser = null;
        res.locals.pseudoUser = null;
        res.locals.isAdmin = null;
        res.locals.isSuperAdmin = null;
    }

    next()
}

module.exports = {
    centralizedVar,
    userData,
}
