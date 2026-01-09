const missionModel = require('../../models/MissionModel');
const { matchedData } = require('express-validator');

exports.editUserProfile = async (req, res) => {

    const renderData = {
        pseudoUser: req.session.userExist.firstName,
        categoriesMission: req.session.categoriesMission,
        alertMsg: null,
    }

    try {

        const idUser = req.session.userExist.id;

        const safeData = matchedData(req)
        const { lastname, firstname, phone, address, cityId, category, } = safeData;

        await missionModel.updateUserProfile(
            idUser,
            lastname,
            firstname,
            phone,
            address,
            cityId,
            category
        );

        if (firstname && firstname.trim().length > 0) {
            req.session.userExist.firstname = firstname;
            renderData.pseudoUser = req.session.userExist.firstname;
        }

        renderData.alertMsg = "Profil mis à jour avec succès !";
        return res.render('account/userProfileSettings', renderData);

    } catch (error) {

        console.error("editUserProfile() --> ", error);

        renderData.alertMsg = "Impossible de modifier les informations de profil";
        return res.render('account/userProfileSettings', renderData);
    }
}