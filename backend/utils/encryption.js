const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = Buffer.from(process.env.AES_SECRET_KEY);


const encryptFile = (inputPath) => {

    return new Promise((resolve, reject) => {

        // Generate a random IV (16 bytes)
        const iv = crypto.randomBytes(16);

        // Create cipher
        const cipher = crypto.createCipheriv(
            ALGORITHM,
            SECRET_KEY,
            iv
        );

        // Encrypted file path
        const outputPath = inputPath + ".enc";

        // Streams
        const input = fs.createReadStream(inputPath);
        const output = fs.createWriteStream(outputPath);

        // Store IV at the beginning of encrypted file
        output.write(iv);

        // Encrypt
        input
            .pipe(cipher)
            .pipe(output);

        output.on("finish", () => {

            resolve({
                encryptedPath: outputPath,
                iv: iv.toString("hex"),
            });

        });

        output.on("error", reject);

    });

};


const decryptFile = (encryptedPath) => {

    return new Promise((resolve, reject) => {

        const fd = fs.openSync(encryptedPath, "r");

        const iv = Buffer.alloc(16);

        fs.readSync(fd, iv, 0, 16, 0);

        fs.closeSync(fd);

        const decipher = crypto.createDecipheriv(

            ALGORITHM,

            SECRET_KEY,

            iv

        );

        // Original filename
        const originalName = path.basename(
            encryptedPath.replace(".enc", "")
        );

        // Directory
        const directory = path.dirname(encryptedPath);

        // Generate unique temporary filename
        const tempFileName =
            `temp_${Date.now()}_${originalName}`;

        const outputPath = path.join(
            directory,
            tempFileName
        );

        const input = fs.createReadStream(
            encryptedPath,
            {
                start: 16,
            }
        );

        const output = fs.createWriteStream(
            outputPath
        );

        input
            .pipe(decipher)
            .pipe(output);

        output.on("finish", () => {

            resolve(outputPath);

        });

        output.on("error", reject);

    });

};

module.exports = {
    encryptFile,
    decryptFile,
};