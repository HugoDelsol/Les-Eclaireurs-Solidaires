const tabSelected = (req, res, next) => {    
    const url = req.url;
    const myReg = /[\d]/g;
    const urlReg = url.replace(myReg, "");
    res.locals.urlFind = urlReg;
    next();
}

module.exports = {
    tabSelected,
}