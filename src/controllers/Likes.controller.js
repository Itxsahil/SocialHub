import { asyncHandler } from "../utils/asyncHendler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../model/like.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    console.log(req.params)
    const { videoId } = req.params
    //TODO: toggle like on video
    if (!videoId) throw new ApiError(404, "Provide a videoId")
    const existingLike = await Like.findOne({ video: videoId, likedby: req.user._id })
    if (existingLike) {
        await Like.findOneAndDelete({ video: videoId, likedby: req.user._id })
        return res.status(200)
            .json(new ApiResponse(200, {}, "Video disliked successfully"))
    }
    const newLike = await Like.create({
        video: videoId,
        likedby: req.user._id
    })
    return res.status(200)
        .json(new ApiResponse(200, newLike, "Video liked Successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}