// One-time script to create the first admin account.
// Run manually: node scripts/seedAdmin.js
// Requires ADMIN_EMAIL and ADMIN_PASSWORD set in your .env

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const run = async () => {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "\n❌ Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before running this script.\n"
    );
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log(`Connected to MongoDB: ${mongoose.connection.host}`);

  const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existing) {
    if (existing.role === "admin") {
      console.log(`\n✅ ${ADMIN_EMAIL} is already an admin. Nothing to do.\n`);
    } else {
      existing.role = "admin";
      await existing.save();
      console.log(`\n✅ Promoted existing user ${ADMIN_EMAIL} to admin.\n`);
    }
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    fullName: ADMIN_NAME || "Administrator",
    email: ADMIN_EMAIL.toLowerCase(),
    password: hashedPassword,
    role: "admin",
    isVerified: true,
  });

  console.log(`\n✅ Admin account created: ${ADMIN_EMAIL}\n`);
  process.exit(0);
};

run().catch((err) => {
  console.error("\n❌ Seed failed:", err.message, "\n");
  process.exit(1);
});
