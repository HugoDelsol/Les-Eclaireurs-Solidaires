const centralizedVar = (req, res, next) => {

    /* --- DONNÉES DE SESSIONS --- */
    res.locals.regions = req.session.regions || [];
    res.locals.categoriesMission = req.session.categoriesMission || [];
    res.locals.admins = req.session.admins || [];
    res.locals.superAdmins = req.session.superAdmins || [];

    /* --- FILTRES ET SÉLECTIONS --- */
    res.locals.idRegion = null;
    res.locals.missionSelected = null;
    res.locals.searchFilters = {
        regionSelected: null,
        categorySelected: null
    };

    /* --- ALERTES / MESSAGES --- */
    res.locals.alertMsg = null;
    res.locals.successAlertMsg = [];
    res.locals.errorAlertMsg = [];

    /* --- LISTES D'UTILISATEURS --- */
    res.locals.listUsers = null;
    res.locals.findVolunteerList = null;

    /* --- MISSIONS --- */
    res.locals.missions = null;
    res.locals.missionsClear = null;
    res.locals.displayMission = [];

    /* --- INFOS DE CONNEXION / PROFIL --- */
    res.locals.firstName = null;
    res.locals.lastName = null;
    res.locals.email = null;
    res.locals.password = null;
    res.locals.passwordConfirm = null;

    /* --- TOKENS --- */
    res.locals.tokenAdmin = null;
    res.locals.tokenSuper = null;
    res.locals.token = null;


    res.locals.stringVal = null;

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