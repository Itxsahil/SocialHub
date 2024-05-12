import { Tweet } from "../model/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHendler.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.uploade.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const imageLocalPath = req.file?.path
    if (!content && !imageLocalPath) throw new ApiError(401, "Enter a valid msg")
    let imageUrl;
    if (imageLocalPath) {
        imageUrl = await uploadOnCloudinary(imageLocalPath)
    }
    
    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
        image: imageUrl.url
    })
    if(!tweet) throw new ApiError(400, "somthing went wrong while the operation")
    return res.status(200)
    .json(new ApiResponse(200, tweet, "Tweet is successfully done"))
})

export {
    createTweet
}