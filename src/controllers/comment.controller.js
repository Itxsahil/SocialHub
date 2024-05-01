import { asyncHandler } from "../utils/asyncHendler.js";
import { Comment } from "../model/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    if (!videoId) throw new ApiError(404, "VideoId required")
    const option = {
        page: parseInt(page),
        limit: parseInt(limit)
    }
    const comments = Comment.paginate(
        { videoId }, option
    )
    if (!comments) throw new ApiError(404, "No comment found for this video")
    return res.status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
})

const addComment = asyncHandler(async (req, res) => {
    const { comment, videoId } = req.body
    if (!comment) throw new ApiError(404, "comment could not be empty")
    if (!videoId) throw new ApiError(404, "unable to get video Id")
    const commented = await Comment.create({
        comment,
        videoId,
        owner: req.user._id
    })
    if (!commented) throw new ApiError(400, "unable to comment on the video")

    return res.status(200)
        .json(new ApiResponse(201, commented, "comment uploaded sucessfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId, videoId } = req.params
    const { comment } = req.body
    if (!videoId) throw new ApiError(404, "provide a video id")
    if (!comment) throw new ApiError(400, "comment couldnot be empty")
    const findComment = await Comment.findOne({ _id: commentId, videoId })
    if (!findComment) throw new ApiError(500, " comment not found ")
    if (findComment.owner.toString() !== req.user._id.toString()) throw new ApiError(400, "you are note the Owner")
    const updatedComment = await Comment.findByIdAndUpdate
        (
            commentId,
            {
                $set: {
                    comment
                }
            },
            {
                new: true
            }
        )
    if (!updatedComment) throw new ApiError(500, "operation failed")
    return res.status(200)
        .json(new ApiResponse(200, updatedComment, "comment updated successfully"))
})

export {
    addComment,
    updateComment
}