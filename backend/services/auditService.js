const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({

    user,

    action,

    description,

    req,

}) => {

    await AuditLog.create({

        user,

        action,

        description,

        ipAddress: req.ip,

        userAgent: req.get("User-Agent"),

    });

};

module.exports = {
    createAuditLog,
};