const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const {
    getAllUsers,
    toggleBlockUser,
    updateUserRole,
    getDashboardStats,
    deleteUser,
    getAllDocuments,
    deleteDocument,
    getAuditLogs,
} = require("../controllers/adminController");


router.get(
    "/dashboard",
    authenticate,
    isAdmin,
    getDashboardStats
);

router.get(
    "/users",
    authenticate,
    isAdmin,
    getAllUsers
);

router.patch(
    "/block-user/:id",
    authenticate,
    isAdmin,
    toggleBlockUser
);

router.patch(
    "/user/:id/role",
    authenticate,
    isAdmin,
    updateUserRole
);

router.delete(
    "/user/:id",
    authenticate,
    isAdmin,
    deleteUser
);

router.get(
    "/documents",
    authenticate,
    isAdmin,
    getAllDocuments
);

router.delete(
    "/document/:id",
    authenticate,
    isAdmin,
    deleteDocument
);

router.get(
    "/audit-logs",
    authenticate,
    isAdmin,
    getAuditLogs
);


module.exports = router;