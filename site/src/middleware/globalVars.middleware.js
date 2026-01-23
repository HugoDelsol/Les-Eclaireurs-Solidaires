const centralizedVar = (req, res, next) => {

    res.locals.regions = req.session.regions || [];
    res.locals.categoriesMission = req.session.categoriesMission || [];

    res.locals.admins = req.session.admins || [];
    res.locals.superAdmins = req.session.superAdmins || [];

    res.locals.alertMsg = null;

    res.locals.missionSelected = null;

    res.locals.searchFilters = {
        regionSelected : null,
        categorySelected : null
    }

    res.locals.listUsers = null;
    res.locals.findVolunteerList = null;

    res.locals.missions = null
    res.locals.missionsClear = null;

    res.locals.firstName = null;
    res.locals.lastName = null;
    res.locals.email = null;
    res.locals.password = null;
    res.locals.passwordConfirm = null;

    res.locals.tokenAdmin = null;
    res.locals.tokenSuper = null;

    next();
}

const userData = (req, res, next) => {

    const user = req.session?.userExist;

    res.locals.idUser = user?.id || null;
    res.locals.pseudoUser = user?.firstName || null;
    res.locals.isAdmin = user?.isAdmin || null;
    res.locals.isSuperAdmin = user?.isSuperAdmin || null;

    next();
}

module.exports = {
    centralizedVar,
    userData,
}