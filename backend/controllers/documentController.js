const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const Document = require("../models/Document");
const { createAuditLog } = require("../services/auditService");

const path = require("path");
const fs = require("fs");

const { encryptFile, decryptFile } = require("../utils/encryption");
// Upload Document
const uploadDocument = asyncHandler(async (req, res) => {
  // Encrypt uploaded file
  const encryptedData = await encryptFile(req.file.path);

  // Delete original file
  fs.unlinkSync(req.file.path);

  const document = await Document.create({
    fileName: path.basename(encryptedData.encryptedPath),
    originalName: req.file.originalname,
    fileType: req.file.originalname.split(".").pop(),
    fileSize: req.file.size,
    uploadedBy: req.user.id,
    filePath: encryptedData.encryptedPath,
    isEncrypted: true,
    iv: encryptedData.iv,
  });

  await createAuditLog({
    user: req.user.id,

    action: "UPLOAD",

    description: `Uploaded "${document.originalName}"`,

    req,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Document uploaded successfully", document));
});

// Get Logged-in User Documents
const getMyDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({
    uploadedBy: req.user.id,
  }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Documents fetched successfully", documents));
});


const downloadDocument = asyncHandler(async (req, res) => {

    const document = await Document.findById(req.params.id);

    if (!document) {

        throw new ApiError(

            404,

            "Document not found"

        );

    }

    if (document.uploadedBy.toString() !== req.user.id) {

        return res.status(403).json({

            success: false,

            message: "Access denied",

        });

    }

    const decryptedPath = await decryptFile(document.filePath);

    await createAuditLog({

        user: req.user.id,

        action: "DOWNLOAD",

        description: `Downloaded "${document.originalName}"`,

        req,

    });

    res.download(

        decryptedPath,

        document.originalName,

        (err) => {

            try {

                if (fs.existsSync(decryptedPath)) {

                    fs.unlinkSync(decryptedPath);

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

// Delete Document
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
    });
  }

  // Check document ownership
  if (document.uploadedBy.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  // Delete encrypted file from uploads folder
  if (fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }

  // Delete document from MongoDB
  await document.deleteOne();

  await createAuditLog({
    user: req.user.id,

    action: "DELETE",

    description: `Deleted "${document.originalName}"`,

    req,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Document deleted successfully", null));
});

module.exports = {
  uploadDocument,
  getMyDocuments,
  downloadDocument,
  deleteDocument,
};
