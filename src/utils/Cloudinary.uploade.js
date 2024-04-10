import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

cloudinary.config({
    cloud_name: 'dz0v3z2y5',
    api_key: '641634265618462',
    api_secret: 'ucNRLNykxPLgbGWS8UNiYr3kjcs'
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log(response)
        console.log("file is uploaded on cloudinary", response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("error while uploading on cloudinary ..", error)
        fs.unlinkSync(localFilePath)
    }
}


// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) { console.log(result); });

export { uploadOnCloudinary }