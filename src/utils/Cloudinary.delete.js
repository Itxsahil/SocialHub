import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

const deleteFromeCloudinary = async (public_url, resource_type) => {
    try {
        if (!public_url) return null;
        const publicId = public_url.split("/").pop().split(".")[0]
        //const public_id = await cloudinary.utils.extractPublicId(public_url)
        await cloudinary.uploader.destroy(publicId, {
            resource_type: resource_type
        })
    } catch (error) {
        console.log("error while deleting on cloudinary ..", error)
    }
}

/*cloudinary.uploader
  .destroy('docs/vegetables')
  .then(result => console.log(result));
  cloudinary.uploader
    .destroy('docs/stream', {resource_type: 'video', type: 'authenticated'})
    .then(result => console.log(result));*/

export { deleteFromeCloudinary }