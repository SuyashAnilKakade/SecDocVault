const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const AuditLog = require("../models/AuditLog");

const getMyAuditLogs = asyncHandler(async (req, res) => {

    const logs = await AuditLog.find({

        user: req.user.id,

    })
        .sort({
            createdAt: -1,
        });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Audit logs fetched successfully",

            logs

        )

    );

});

module.exports = {
    getMyAuditLogs,
};