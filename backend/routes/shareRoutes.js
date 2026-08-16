const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
    generateShareLink,
    downloadSharedDocument,
} = require("../controllers/shareController");

// Generate Share Link
router.post(
    "/generate/:documentId",
    authenticate,
    generateShareLink
);

// Download Shared Document
router.post(
    "/download/:token",
    downloadSharedDocument
);

module.exports = router;