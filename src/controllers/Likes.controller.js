import { asyncHandler } from "../utils/asyncHendler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../model/like.model.js"
import mongoose from "mongoose"

const toggleVideoLike = asyncHandler(async (req, res) => {
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
    if (!commentId) throw new ApiError(404, "Provide a commentId")
    const existingComment = await Like.findOne({ comment: commentId, likedby: req.user._id })
    if (existingComment) {
        await Like.findOneAndDelete({ comment: commentId, likedby: req.user._id })
        return res.status(200)
            .json(new ApiResponse(200, {}, "Comment disliked successfully"))
    }
    const newComment = await Like.create({
        comment: commentId,
        likedby: req.user._id
    })
    return res.status(200)
        .json(new ApiResponse(200, newComment, "Comment liked Successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const videos = await Like.find({
        likedby: req.user._id,
        video: {
            $exists: true
        },
        comment: {
            $exists: false
        },
        tweet: {
            $exists: false
        }

    }).sort({createdAt: -1})

    return res.status(200)
    .json(new ApiResponse(201, videos, "Liked videos fatched sucessfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}