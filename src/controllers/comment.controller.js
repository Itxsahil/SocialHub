import { asyncHandler } from "../utils/asyncHendler.js";
import {Comment } from "../model/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const comments = Comment.aggregate([
        {
            $lookup: {
                from: "",
                localField: "_id",
                foreignField: "channel",
                as: "subcribers"
            }
        },
    ])
})