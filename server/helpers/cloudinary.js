// const cloudinary = require("cloudinary").v2;

// //configure with env data
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadMediaToCloudinary = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "auto",
//     });

//     return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Error uploading to cloudinary");
//   }
// };

// const deleteMediaFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to delete assest from cloudinary");
//   }
// };

// module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };



const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Configure Multer to use MEMORY storage (RAM) instead of Disk
// This works on both Vercel and Localhost
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// 2. Helper function to upload the Buffer to Cloudinary
async function imageUploadUtil(file) {
  return new Promise((resolve, reject) => {
    // Create a stream to upload the buffer directly
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // Automatically detect image/video
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // End the stream with the file buffer
    uploadStream.end(file.buffer);
  });
}

// Delete helper (remains the same)
async function deleteMediaFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete asset from Cloudinary");
  }
}

module.exports = { upload, imageUploadUtil, deleteMediaFromCloudinary };