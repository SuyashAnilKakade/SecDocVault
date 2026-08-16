const dotenv = require("dotenv");
const validateEnv = require("./config/validateEnv");


dotenv.config();
validateEnv();

const app = require("./app");

const connectDB = require("./config/db");
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});