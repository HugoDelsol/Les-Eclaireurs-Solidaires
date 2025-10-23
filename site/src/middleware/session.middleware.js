
const logout = (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            console.error('Erreur lors de la destruction se la session :', err);
            return res.status(500).send('Impossible de ce déconnecter');
        }
        
        res.redirect('/')
    })
}

module.exports = {
    logout,
}