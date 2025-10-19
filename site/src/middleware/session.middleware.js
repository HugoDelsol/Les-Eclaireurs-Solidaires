const logout = (req, res) => {

    req.session.destroy((err) => {
        res.redirect('/')
    })

}

module.exports = {
    logout,
}