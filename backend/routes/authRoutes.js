const express = require("express");

const router = express.Router();

// Controllers
const { register, login, refreshToken, logout, testEmail, forgotPassword, resetPassword } = require("../controllers/authController");

// Middleware
const validate = require("../middleware/validate");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Validators
const {
    registerValidation,
    loginValidation,
} = require("../validators/authValidator");

const { authLimiter } = require("../middleware/rateLimiter");

// =========================
// Authentication Routes
// =========================



//swagger comments for register route
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Suyash Kakade
 *               email:
 *                 type: string
 *                 example: suyash@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 */
// Register User
router.post(
    "/register",
    authLimiter,
    registerValidation,
    validate,
    register
);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: suyash@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
// Login User
router.post(
    "/login",
    authLimiter,
    loginValidation,
    validate,
    login
);


/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Generate a new access token using refresh token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
// Refresh Access Token
router.post(
    "/refresh-token",
    authLimiter,
    refreshToken
);


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/logout",
    authenticate,
    logout
);


/**
 * @swagger
 * /api/auth/test-email:
 *   get:
 *     summary: Send a test email
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Test email sent successfully
 */
router.post(
    "/test-email",
    testEmail
);


/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: suyash@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post(
    "/forgot-password",
    authLimiter,
    forgotPassword
);


/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: abcd123456789xyz
 *               password:
 *                 type: string
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post(
    "/reset-password",
    authLimiter,
    resetPassword
);

router.get(
    "/profile",
    authenticate,
    (req, res) => {

        res.status(200).json({
            success: true,
            user: req.user
        });

    }
);

router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    (req, res) => {

        res.json({
            success: true,
            message: "Welcome Admin",
            user: req.user
        });

    }
);

module.exports = router;