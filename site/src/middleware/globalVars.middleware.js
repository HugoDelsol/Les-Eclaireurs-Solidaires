const centralizedVar = (req, res, next) => {

    // --- ALERT MESSAGE --- //
    res.locals.alertMsg = null;

    // --- MISSION --- //
    res.locals.regions = null;
    res.locals.missions = null;
    res.locals.missionsUser = null;
    res.locals.categoriesMission = null;

    // --- SIGNUP PAGE --- //
    res.locals.firstName = null;
    res.locals.lastName = null;
    res.locals.email = null;
    res.locals.password = null;
    res.locals.passwordConfirm = null;

    next();

}

const userData = (req, res, next) => {

    if (req.session && req.session.userExist) {

        res.locals.idUser = req.session.userExist.id;
        res.locals.pseudoUser = req.session.userExist.firstName;

    } else {

        res.locals.idUser = null
        res.locals.pseudoUser = null
    }

    next()
}

module.exports = {
    centralizedVar,
    userData,
}
