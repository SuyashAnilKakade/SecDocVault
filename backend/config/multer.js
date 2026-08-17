const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Absolute path to the uploads folder, based on this file's location
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Ensure the folder exists before multer tries to write into it
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {

    const allowedExtensions = [
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    } else {
        cb(
    new Error(
        "Only PDF, PNG, JPG and JPEG files are allowed."
    )
);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

module.exports = upload;
