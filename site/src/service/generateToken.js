const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretToken = process.env.TOKEN_SECRET;

exports.generateTokenAdmin = (email, role) => {

    const baseToken = { email, role };

    const expiry = { expiresIn: "2d" };

    return jwt.sign(baseToken, secretToken, expiry);
}

const superAdminToken = exports.generateTokenAdmin("Adm1ne@gmail.com", "superAdmin");
//console.log("Token super admin :" , superAdminToken);

const adminToken = exports.generateTokenAdmin("adminRegister@gmail.com", "admin");
//console.log("Token admin :" , adminToken);

exports.verifyToken = (token, email) => {

    try {

        const decoded = jwt.verify(token, secretToken);

        if (decoded.email != email) return null;

        if (decoded.role === "superAdmin") return "superAdmin";

        if (decoded.role === "admin") return "admin";

        return null;

    } catch (error) {

        return null;
    }
}

