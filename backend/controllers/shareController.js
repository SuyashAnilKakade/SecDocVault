const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const fs = require("fs");
const shareService = require("../services/shareService");

const generateShareLink = asyncHandler(async (req, res) => {

    const { password } = req.body;

    const result = await shareService.generateShareLink(

        req.params.documentId,

        req.user.id,

        password

    );

    return res.status(201).json(

        new ApiResponse(

            201,

            "Share link generated successfully",

            result

        )

    );

});


const downloadSharedDocument = asyncHandler(async (req, res) => {

    const { password } = req.body;

    const result = await shareService.downloadSharedDocument(

        req.params.token,

        password

    );

    res.download(

        result.decryptedPath,

        result.originalName,

        (err) => {

            try {

                if (fs.existsSync(result.decryptedPath)) {

                    fs.unlinkSync(result.decryptedPath);

                }

            } catch (error) {

                console.error(

                    "Failed to delete temporary file:",

                    error.message

                );

            }

        }

    );

});

module.exports = {
    generateShareLink,
    downloadSharedDocument,

};