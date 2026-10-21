const path = require("path");

const STORAGE_CONFIG = {
    owncloud: {
        baseUrl: process.env.OWNCLOUD_URL,
        username: process.env.OWNCLOUD_USERNAME,
        password: process.env.OWNCLOUD_PASSWORD,

        // Path di dalam OwnCloud
        rootPath: process.env.OWNCLOUD_ROOT_PATH || "AppService/assets",

        // URL yang akan dikembalikan kepada client
        publicUrl:
            process.env.PUBLIC_FILE_URL ||
            "http://localhost:8080/AppService/assets",
    },

    // Extension yang diperbolehkan
    allowedFiles: {
        image: {
            extensions: [".png", ".jpg", ".jpeg"],

            mimeTypes: [
                "image/png",
                "image/jpeg",
            ],
        },

        // document: {
        //     extensions: [".pdf", ".docx"],
        //     mimeTypes: [
        //         "application/pdf",
        //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        //     ]
        // }
    },
};

module.exports = STORAGE_CONFIG;