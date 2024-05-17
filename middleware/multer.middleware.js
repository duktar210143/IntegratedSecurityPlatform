const multer = require('multer');
const fs = require('fs');

// function to set up and return a multer middleware 
const setUpMultMiddleWare = () => {
    try {
        console.log('test1');

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                const uploadDir = "./uploads";
                console.log("Received file:", file);

                // create an upload directory if it doesn't exist
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir);
                }
                cb(null, uploadDir);
            },

            filename: function (req, file, cb) {
                const timeStamp = new Date().toISOString().replace(/:/g, "");
                const safeOriginalName = file.originalname.replace(/\s/g, "_");
                cb(null, timeStamp + safeOriginalName);
            }
        });
        console.log('test');

        // configuring the storage engine to where and how the file should be stored in the server
        const upload = multer({ storage: storage });
        return upload.single('image');
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to propagate it further if needed
    }
};

module.exports = setUpMultMiddleWare;
