const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const upload = require("../config/multer");

const {
    uploadDocument,
    getMyDocuments,
    downloadDocument,
    deleteDocument,
} = require("../controllers/documentController");



/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       401:
 *         description: Unauthorized
 */
// Upload a document
router.post(
    "/upload",
    authenticate,
    upload.single("document"),
    uploadDocument
);



/**
 * @swagger
 * /api/documents/my-documents:
 *   get:
 *     summary: Get all documents of logged-in user
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents fetched successfully
 */
// Get all documents of logged-in user
router.get(
    "/my-documents",
    authenticate,
    getMyDocuments
);


/**
 * @swagger
 * /api/documents/download/{id}:
 *   get:
 *     summary: Download a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: Document not found
 */
router.get(
    "/download/:id",
    authenticate,
    downloadDocument
);



/**
 * @swagger
 * /api/documents/delete/{id}:
 *   delete:
 *     summary: Delete a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted successfully
 */
// Delete Document
router.delete(
    "/:id",
    authenticate,
    deleteDocument
);

module.exports = router;