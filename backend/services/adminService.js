const User = require("../models/User");
const Document = require("../models/Document");
const AuditLog = require("../models/AuditLog");
const fs = require("fs");
const path = require("path");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/ApiError");
const { USER_ROLES } = require("../config/constants");


const getAllUsers = async (query) => {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 5;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.search) {

        filter.$or = [

            {
                fullName: {
                    $regex: query.search,
                    $options: "i",
                },
            },

            {
                email: {
                    $regex: query.search,
                    $options: "i",
                },
            },

        ];

    }

    if (query.role) {

        filter.role = query.role;

    }

    if (query.blocked !== undefined) {

        filter.isBlocked = query.blocked === "true";

    }

    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter)
        .select("-password -refreshToken -passwordResetToken -passwordResetExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {

        totalUsers,

        currentPage: page,

        totalPages: Math.ceil(totalUsers / limit),

        users,

    };

};


const toggleBlockUser = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    return user;

};


const updateUserRole = async (userId, role, requestingUserId) => {

    if (!Object.values(USER_ROLES).includes(role)) {
        throw new Error("Invalid role");
    }

    if (userId === requestingUserId) {
        throw new Error("You cannot change your own role");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    user.role = role;

    await user.save();

    return user;

};


const deleteUser = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const documents = await Document.find({
        uploadedBy: userId,
    });

    for (const document of documents) {

        if (
            document.filePath &&
            fs.existsSync(document.filePath)
        ) {
            fs.unlinkSync(document.filePath);
        }

    }

    await Document.deleteMany({
        uploadedBy: userId,
    });

    await AuditLog.deleteMany({
        user: userId,
    });

    await User.findByIdAndDelete(userId);

    return user;

};


const getDashboardStats = async () => {

    const totalUsers = await User.countDocuments();

    const totalAdmins = await User.countDocuments({
        role: "admin",
    });

    const blockedUsers = await User.countDocuments({
        isBlocked: true,
    });

    const totalDocuments = await Document.countDocuments();

    const recentUsers = await User.find()
        .select("-password -refreshToken -passwordResetToken -passwordResetExpires")
        .sort({ createdAt: -1 })
        .limit(5);

    const recentDocuments = await Document.find()
        .populate("uploadedBy", "fullName email")
        .sort({ createdAt: -1 })
        .limit(5);

    const recentAuditLogs = await AuditLog.find()
        .populate("user", "fullName email")
        .sort({ createdAt: -1 })
        .limit(10);

    return {

        statistics: {

            totalUsers,

            totalAdmins,

            blockedUsers,

            totalDocuments,

        },

        recentUsers,

        recentDocuments,

        recentAuditLogs,

    };

};


const getAllDocuments = async (query) => {

    const page = parseInt(query.page) || 1;

    const limit = parseInt(query.limit) || 5;

    const skip = (page - 1) * limit;

    const filter = {};

    if (query.search) {

        filter.originalName = {

            $regex: query.search,

            $options: "i",

        };

    }

    const totalDocuments = await Document.countDocuments(filter);

    const documents = await Document.find(filter)

        .populate("uploadedBy", "fullName email")

        .sort({

            createdAt: -1,

        })

        .skip(skip)

        .limit(limit);

    return {

        totalDocuments,

        currentPage: page,

        totalPages: Math.ceil(totalDocuments / limit),

        documents,

    };

};


const deleteDocument = async (documentId) => {

    const document = await Document.findById(documentId);

    if (!document) {
        throw new Error("Document not found");
    }

    if (
        document.filePath &&
        fs.existsSync(document.filePath)
    ) {
        fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(documentId);

    return document;

};


const getAuditLogs = async (query) => {

    const page = parseInt(query.page) || 1;

    const limit = parseInt(query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    if (query.action) {

        filter.action = query.action;

    }

    if (query.search) {

        filter.description = {

            $regex: query.search,

            $options: "i",

        };

    }

    const totalLogs = await AuditLog.countDocuments(filter);

    const logs = await AuditLog.find(filter)

        .populate("user", "fullName email")

        .sort({

            createdAt: -1,

        })

        .skip(skip)

        .limit(limit);

    return {

        totalLogs,

        currentPage: page,

        totalPages: Math.ceil(totalLogs / limit),

        logs,

    };

};

module.exports = {
    getAllUsers,
    toggleBlockUser,
    updateUserRole,
    deleteUser,
    getDashboardStats,
    getAllDocuments,
    deleteDocument,
    getAuditLogs,
};