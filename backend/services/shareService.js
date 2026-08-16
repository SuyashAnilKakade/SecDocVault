const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");

const ShareLink = require("../models/ShareLink");
const Document = require("../models/Document");

const { decryptFile } = require("../utils/encryption");

const ApiError = require("../utils/ApiError");



const generateShareLink = async (documentId, userId, password = null) => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new ApiError(404, "Document not found");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  let hashedPassword = null;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const shareLink = await ShareLink.create({
    document: documentId,

    token,

    expiresAt,

    createdBy: userId,
    password: hashedPassword,
  });

 return {
    shareUrl: `${process.env.FRONTEND_URL}/share/${token}`,
    expiresAt: shareLink.expiresAt,
};
};



const downloadSharedDocument = async (
    token,
    password = null
) => {
  
  const shareLink = await ShareLink.findOne({
    token,
}).populate("document");

  if (!shareLink) {
    throw new ApiError(
      404,

      "Invalid share link",
    );
  }

  if (new Date() > shareLink.expiresAt) {
    throw new ApiError(
      400,

      "Share link has expired",
    );
  }

  if (shareLink.downloadCount >= shareLink.maxDownloads) {
    throw new ApiError(
      400,

      "Download limit exceeded",
    );
  }

  if (shareLink.password) {

    if (!password) {

        throw new ApiError(

            401,

            "Password is required"

        );

    }

    const isMatch = await bcrypt.compare(

        password,

        shareLink.password

    );

    if (!isMatch) {

        throw new ApiError(

            401,

            "Invalid password"

        );

    }

}

  shareLink.downloadCount += 1;

  await shareLink.save();

  const decryptedPath = await decryptFile(shareLink.document.filePath);

  return {
    decryptedPath,

    originalName: shareLink.document.originalName,
  };
};

module.exports = {
  generateShareLink,
  downloadSharedDocument,
};
