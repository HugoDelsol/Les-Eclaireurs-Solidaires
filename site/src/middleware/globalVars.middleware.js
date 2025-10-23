const centralizedVar =  (req, res, next) => {
    
    res.locals.pseudoUser = null;
    res.locals.alertMsg = null;
    res.locals.categoriesMission = null;

    next();
}

module.exports = {
    centralizedVar,
}