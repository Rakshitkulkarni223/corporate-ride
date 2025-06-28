const { Readable } = require("stream");
const { getBucket } = require("../database");

const postImageUpload = async (files, fields, mobileNumber) => {
    let bucket = getBucket()
    const uploadedFiles = {};
    const uploadedFileIds = [];

    for (const field of fields) {
        const file = files[field]?.[0];
        if (!file) continue;

        const stream = Readable.from(file.buffer);
        const ext = file.originalname.split(".").pop();
        const filename = `${mobileNumber}-${field}.${ext}`;

        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                fieldName: field,
                uploadedBy: mobileNumber,
            },
            contentType: file.mimetype,
        });

        const fileId = uploadStream.id;

        await new Promise((resolve, reject) => {
            stream.pipe(uploadStream)
                .on("error", reject)
                .on("finish", resolve);
        });

        uploadedFiles[field] = fileId;
        uploadedFileIds.push(fileId);
    }
    return {
        uploadedFiles,
        uploadedFileIds
    }
}

module.exports = {
    postImageUpload
}