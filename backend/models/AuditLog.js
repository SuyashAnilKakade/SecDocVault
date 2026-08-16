const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        action: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        ipAddress: {
            type: String,
        },

        userAgent: {
            type: String,
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "AuditLog",
    auditLogSchema
);