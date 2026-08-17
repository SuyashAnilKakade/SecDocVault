const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const register = async (userData) => {
  const { fullName, email, password } = userData;

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

const login = async (userData) => {
  const { email, password } = userData;

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isBlocked) {
    throw new ApiError(
        403,
        "Your account has been blocked. Please contact the administrator."
    );
}

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Find user
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check token stored in database
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Generate new access token
  const accessToken = generateAccessToken(user);

  return {
    accessToken,
  };
};

const logout = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = null;

  await user.save();

  return {
    message: "Logout successful",
  };
};

const sendTestEmail = async () => {
  await sendEmail(
    process.env.EMAIL_USER,

    "SecureDocVault Test Email",

    "Congratulations! Your email configuration is working successfully.",
  );

  return {
    message: "Test email sent successfully",
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate Random Token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash Token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Hash
  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail(
    user.email,

    "Reset Password",

    `Click the link below to reset your password:

${resetLink}

This link expires in 15 minutes.`,
  );

  return {
    message: "Password reset email sent successfully",
  };
};


const resetPassword = async (token, newPassword) => {

    // Hash incoming token
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Find user
    const user = await User.findOne({

        passwordResetToken: hashedToken,

        passwordResetExpires: {
            $gt: Date.now(),
        },

    });

    if (!user) {

        throw new ApiError(
            400,
            "Invalid or expired reset token"
        );

    }

    // Hash new password
    const hashedPassword =
        await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // Clear reset fields
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    // Logout from all devices
    user.refreshToken = null;

    await user.save();

    return {
        message: "Password reset successful",
        userId: user._id,
    };

};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  sendTestEmail,
  forgotPassword,
  resetPassword,
};
