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
    res.locals.historyMissionUser = null;

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

    const user = req.sesion?.userExist;

    res.locals.idUser = user?.id || null;
    res.locals.pseudoUser = user?.firstName || null;
    res.locals.isAdmin = user?.isAdmin || null;
    res.locals.isSuperAdmin = user?.isSuperAdmin || null;

    next()
}

module.exports = {
    centralizedVar,
    userData,
}
