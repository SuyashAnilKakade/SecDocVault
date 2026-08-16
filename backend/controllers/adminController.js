const asyncHandler = require("../utils/asyncHandler");
const adminService = require("../services/adminService");
const ApiResponse = require("../utils/ApiResponse");
const { createAuditLog } = require("../services/auditService");


const getAllUsers = asyncHandler(async (req, res) => {

    const result = await adminService.getAllUsers(req.query);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Users fetched successfully",

            result

        )

    );

});


const toggleBlockUser = asyncHandler(async (req, res) => {

    const user = await adminService.toggleBlockUser(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,

            user

        )

    );

});


const updateUserRole = asyncHandler(async (req, res) => {

    const { role } = req.body;

    const user = await adminService.updateUserRole(
        req.params.id,
        role,
        req.user.id
    );

    await createAuditLog({

        user: req.user.id,

        action: "UPDATE_ROLE",

        description: `Changed role of ${user.email} to ${user.role}`,

        req,

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            `User role updated to ${user.role}`,

            user

        )

    );

});


const getDashboardStats = asyncHandler(async (req, res) => {

    const stats = await adminService.getDashboardStats();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Dashboard statistics fetched successfully",

            stats

        )

    );

});


const deleteUser = asyncHandler(async (req, res) => {

    const deletedUser = await adminService.deleteUser(
        req.params.id
    );

    await createAuditLog({

        user: req.user.id,

        action: "DELETE_USER",

        description: `Deleted user ${deletedUser.email}`,

        req,

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "User deleted successfully",

            deletedUser

        )

    );

});


const getAllDocuments = asyncHandler(async (req, res) => {

    const result = await adminService.getAllDocuments(req.query);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Documents fetched successfully",

            result

        )

    );

});


const deleteDocument = asyncHandler(async (req, res) => {

    const deletedDocument = await adminService.deleteDocument(
        req.params.id
    );

    await createAuditLog({

        user: req.user.id,

        action: "DELETE_DOCUMENT",

        description: `Deleted document ${deletedDocument.originalName}`,

        req,

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Document deleted successfully",

            deletedDocument

        )

    );

});


const getAuditLogs = asyncHandler(async (req, res) => {

    const result = await adminService.getAuditLogs(req.query);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Audit logs fetched successfully",

            result

        )

    );

});


module.exports = {
    getAllUsers,
    toggleBlockUser,
    updateUserRole,
    getDashboardStats,
    deleteUser,
    getAllDocuments,
    deleteDocument,
    getAuditLogs,
};