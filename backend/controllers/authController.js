const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { createAuditLog } = require("../services/auditService");


const register = asyncHandler(async (req, res) => {

    const user = await authService.register(req.body);

    res
        .status(201)
        .json(new ApiResponse(201, "User registered successfully", user));

});


const login = asyncHandler(async (req, res) => {

    const result = await authService.login(req.body);

    await createAuditLog({

        user: result.user.id,

        action: "LOGIN",

        description: "User logged in",

        req,

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Login successful",

            result

        )

    );

});


const refreshToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Access token refreshed successfully",
                result
            )
        );

});


const logout = asyncHandler(async (req, res) => {

    const result = await authService.logout(req.user.id);

    await createAuditLog({

    user: req.user.id,

    action: "LOGOUT",

    description: "User logged out",

    req,

});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Logout successful",
                result
            )
        );

});

const testEmail = asyncHandler(async (req, res) => {

    const result = await authService.sendTestEmail();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Test email sent successfully",

            result

        )

    );

});


const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    await createAuditLog({

        user: result.userId,

        action: "FORGOT_PASSWORD",

        description: "Password reset requested",

        req,

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Password reset email sent successfully",

            result

        )

    );

});


const resetPassword = asyncHandler(async (req, res) => {

    const { token, password } = req.body;

    const result = await authService.resetPassword(
        token,
        password
    );

    await createAuditLog({

        user: result.userId,

        action: "RESET_PASSWORD",

        description: "Password reset completed",

        req,

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            "Password reset successfully",

            result

        )

    );

});

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    testEmail,
    forgotPassword,
    resetPassword,
};