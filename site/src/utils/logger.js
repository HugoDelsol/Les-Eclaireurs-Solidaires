const winston = require('winston');
const path = require('path')

const customFormat = winston.format.printf(({ timestamp, stack }) => {
    return `${timestamp} ---> ${stack}`
})

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.errors({stack: true}),
        customFormat
    ),
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log') }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            winston.format.errors({stack: true}),
            customFormat
        ),
    }));
}

module.exports = logger;
