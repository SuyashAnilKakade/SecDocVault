const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        fileType: {
            type: String,
            required: true,
        },

        fileSize: {
            type: Number,
            required: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        filePath: {
            type: String,
            required: true,
        },

        isEncrypted: {
            type: Boolean,
            default: false,
        },

        iv: {
    type: String,
},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Document", documentSchema);