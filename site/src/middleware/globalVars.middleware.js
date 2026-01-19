const centralizedVar = (req, res, next) => {

    res.locals.regions = req.session.regions || [];
    res.locals.categoriesMission = req.session.categoriesMission || [];

    res.locals.admins = req.session.admins || [];
    res.locals.superAdmins = req.session.superAdmins || [];

    res.locals.alertMsg = null;

    res.locals.missionSelected = null;
    res.locals.categorySelected = null;
    res.locals.regionSelected = null;

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







/* const centralizedVar = (req, res, next) => {



    // --- ALERT MESSAGE --- //
    res.locals.alertMsg = null;

    res.locals.renderSata = null;

    // --- MISSION --- //
    res.locals.regions = null;
    res.locals.missions = null;
    res.locals.missionsUser = null;
    res.locals.categoriesMission = null;
    res.locals.missionSelected = null;
    res.locals.categorySelected = null;
    res.locals.regionSelected = null;
    res.locals.historyMissionUser = null;
    res.locals.missionsClear = null;

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

    const user = req.session?.userExist;

    res.locals.idUser = user?.id || null;
    res.locals.pseudoUser = user?.firstName || null;
    res.locals.isAdmin = user?.isAdmin || null;
    res.locals.isSuperAdmin = user?.isSuperAdmin || null;

    next();
}

const renderData = (req, res, next) => {

    res.locals.renderData = {        
        
        regions: req.session.regions || null,
        categoriesMission: req.session.categoriesMission || null,

        categorySelected: res.locals.categorySelected || null,
        regionSelected: res.locals.regionSelected || null,        
        missionSelected: res.locals.clearData || null,

        missionsClear: res.locals.missionsClear || null,
        

        alertMsg: res.locals.alertMsg || null,
    }

    next();
}

module.exports = {
    centralizedVar,
    userData,
    renderData
}
 */