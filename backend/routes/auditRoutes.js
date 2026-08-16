const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {
    getMyAuditLogs,
} = require("../controllers/auditController");


/**
 * @swagger
 * /api/audit/my-logs:
 *   get:
 *     summary: Get audit history of logged-in user
 *     tags:
 *       - Audit Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit logs fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/my-logs",
    authenticate,
    getMyAuditLogs
);

module.exports = router;