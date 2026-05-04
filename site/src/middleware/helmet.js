const helmet = require("helmet");

const helmetConfig = helmet({

    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],

            scriptSrc: [
                "'self'",
                "'sha256-ClMSStZrmFnLxwIVeNk5UaRKSqJTOV6O+CpZcXoqR6M='",
                "cdnjs.cloudflare.com"
            ],

            styleSrc: [
                "'self'",
                "https://fonts.googleapis.com",
                "'unsafe-inline'"
            ],

            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com"
            ],

            imgSrc: [
                "'self'",
                "plus.unsplash.com",
                "images.unsplash.com",
                "jeveuxaider.fra1.digitaloceanspaces.com",
                "www.saint-brieuc.bzh",
                "data:"
            ],

            connectSrc: [
                "'self'"
            ],

            objectSrc: ["'none'"],

            upgradeInsecureRequests: []
        }
    },

    frameguard: {
        action: 'deny'
    },

    referrerPolicy: {
        policy: 'no-referrer'
    },

    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },

    noSniff: true
});

module.exports = helmetConfig;
