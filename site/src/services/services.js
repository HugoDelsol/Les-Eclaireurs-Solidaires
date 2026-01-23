const jwt = require('jsonwebtoken');
require('dotenv').config();
const missionModel = require('../models/MissionModel');

const secretToken = process.env.TOKEN_SECRET;

exports.generateToken = (email, role) => {

    try {

        const baseToken = { email, role };

        const expiry = { expiresIn: "1d" };

        return jwt.sign(baseToken, secretToken, expiry);

    } catch (error) {

        console.log("Generate Token Service :", error);
        return null;
    }
}

exports.verifyToken = (token, email) => {

    try {

        const decoded = jwt.verify(token, secretToken);

        if (decoded.email != email) return null;

        if (decoded.role === "superAdmin") return "superAdmin";

        if (decoded.role === "admin") return "admin";

        return null;

    } catch (error) {

        console.log("Generate Token Service :", error);
        return null;
    }
}

exports.filterOutRegisteredMissions = async (req, missionsSelected) => {

    try {

        let filteredMission = [];

        if (!missionsSelected) {            
            
            filteredMission = await missionModel.getAllMission();
            
        } else {
            
            filteredMission = missionsSelected;
        }

        const idUser = req.session.userExist.id

        const alreadyRegisteredByUser = await missionModel.alreadyRegistered(idUser)

        if (filteredMission.length > 0 && alreadyRegisteredByUser.length > 0) {
            for (let i = 0; i < alreadyRegisteredByUser.length; i++) {
                for (let u = 0; u < filteredMission.length; u++) {
                    if (alreadyRegisteredByUser[i]._id_mission === filteredMission[u].id_mission) {
                        filteredMission.splice([u], 1);
                    }
                }
            }
        }

        return filteredMission;

    } catch (error) {

        console.log("filterOutRegisteredMissions : ", error);
        return null;
    }
}

