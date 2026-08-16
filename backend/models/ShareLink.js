const mongoose = require("mongoose");

const shareLinkSchema = new mongoose.Schema(

    {

        document: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Document",

            required: true,

        },

        token: {

            type: String,

            required: true,

            unique: true,

        },

        expiresAt: {

            type: Date,

            required: true,

        },

        password: {

            type: String,

            default: null,

        },

        downloadCount: {

            type: Number,

            default: 0,

        },

        maxDownloads: {

            type: Number,

            default: 5,

        },

        createdBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

    },

    {

        timestamps: true,

    }

);

module.exports = mongoose.model(
    "ShareLink",
    shareLinkSchema
);