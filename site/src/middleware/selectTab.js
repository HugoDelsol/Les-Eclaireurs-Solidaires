const tabSelected = (req, res, next) => {
    const url = req.url   
    res.locals.urlFind = url
    next()
}

module.exports = {
    tabSelected
}