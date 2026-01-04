const missionModel = require('../../models/MissionModel');

exports.editUserProfile = async (req, res) => {

    const renderData = {
        pseudoUser: req.session.userExist.firstName,
        categoriesMission: req.session.categoriesMission,
        alertMsg: null,
    }

    try {

        const idUser = req.session.userExist.id;

        const lastName = req.body.lastname;
        const firstName = req.body.firstname;
        const phone = req.body.phone;
        const address = req.body.address;
        const cityId = req.body.cityId;
        const category = req.body.category;

        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;

        await missionModel.updateUserProfile(
            idUser,
            lastName,
            firstName,
            phone,
            address,
            cityId,
            category
        );

        if (firstName.trim().length > 0) {
            req.session.userExist.firstName = firstName;
            renderData.pseudoUser = req.session.userExist.firstName;
        }

        renderData.alertMsg = "Profil mis à jour avec succès !";
        return res.render('account/userProfileSettings', renderData);

    } catch (error) {

        console.error("editUserProfile() --> ", error);

        renderData.alertMsg = "Impossible de modifier les informations de profil";
        return res.render('account/userProfileSettings', renderData);
    }
}