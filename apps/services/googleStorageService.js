const { Storage } = require('@google-cloud/storage');

// Khởi tạo client Google Cloud Storage với tệp JSON
const storage = new Storage({
  keyFilename: './apps/config/webbookinghomestay-b7943a3b9a0d.json', // Đường dẫn đầy đủ tới file JSON
});

// Tên bucket
const bucketName = 'oneraix113';

// Hàm upload ảnh
const uploadFile = async (buffer, destination) => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(destination);

    // Lưu tệp lên bucket
    await file.save(buffer, {
      resumable: false,
      metadata: {
        contentType: 'auto',
      },
    });

    console.log(`File uploaded to ${destination}`);
    return `https://storage.googleapis.com/${bucketName}/${destination}`;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
};

module.exports = { uploadFile };
