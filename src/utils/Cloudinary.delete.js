import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: 'dz0v3z2y5',
    api_key: '641634265618462',
    api_secret: 'ucNRLNykxPLgbGWS8UNiYr3kjcs'
});


const deleteFromeCloudinary = async (public_url) =>{
    try {
        if(!public_url) return null;
        const public_id = await cloudinary.utils.extractPublicId(public_url)
        await cloudinary.uploader.destroy(public_id,
            {resource_type:"auto" , type: "authenticated"})
        .then(result => console.log(result))
    } catch (error) {
        console.log("error while uploading on cloudinary ..", error)
    }
}

/*cloudinary.uploader
  .destroy('docs/vegetables')
  .then(result => console.log(result));
  cloudinary.uploader
    .destroy('docs/stream', {resource_type: 'video', type: 'authenticated'})
    .then(result => console.log(result));*/

export {deleteFromeCloudinary}