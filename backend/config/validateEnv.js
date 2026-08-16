const requiredEnvVariables = [
    "PORT",
    "MONGODB_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "AES_SECRET_KEY",
    "EMAIL_USER",
    "EMAIL_PASS",
    "BASE_URL",
];

const validateEnv = () => {

    const missingVariables = requiredEnvVariables.filter(
        variable => !process.env[variable]
    );

    if (missingVariables.length > 0) {

        console.error("\n❌ Missing Environment Variables:\n");

        missingVariables.forEach(variable => {
            console.error(`- ${variable}`);
        });

        console.error(
            "\nPlease check your .env file.\n"
        );

        process.exit(1);

    }

};

module.exports = validateEnv;