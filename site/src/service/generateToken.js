const jwt = require('jsonwebtoken');
require('dotenv').config();

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

