import { asyncHandler } from "../utils/asyncHendler.js";
import { Video } from "../model/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.uploade.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async (req, res) => {

    //1- take all the data from user
    // 2-destr. those data// 2-destr. those data
    // 3-check required fields are present or not
    const { title, videoDescription } = req.body
    if (!title) throw new ApiError(400, "Title is required..")
    if (!videoDescription) throw new ApiError(400, "videoDescription is required..")

    // 4-check the files are present or not
    const videoLocalPath = req.files?.video[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath) throw new ApiError(404, "please give a video")
    if (!thumbnailLocalPath) throw new ApiError(404, "please give a thumbnail")

    // 5-upload them on cloudinarry
    const videoLink = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoLink) throw new ApiError(400, "cloudinary is not working properly..");
    if (!thumbnail) throw new ApiError(400, "cloudinary is not working properly..");

    // 6-svae the data on db

    const videoData = await Video.create({
        videoLink: videoLink.url,
        title,
        thumbnail: thumbnail.url,
        videoOwner: req.user._id,
        videoDescription,
        duration: videoLink.duration
    })
    // 7-return the res to the user
    const UploadedVideo = await Video.findById(videoData._id).select("-isPublished")

    if (!UploadedVideo) throw new ApiError(400, "Somthing went wrong while Uploading the video")
    return res.status(200)
        .json(new ApiResponse(200, UploadedVideo, "Video is uploaded successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(404, "provide a valid video Id")

    const video = await Video.findById({ _id: videoId }).select("-isPublished")
    if (!video) throw new ApiError(401, " video os not present at DB")

    return res.status(200)
        .json(new ApiResponse(200, video, "Video fatched successfully"))
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, videoDescription } = req.body
    if (!videoId) throw new ApiError(404, "Please provide a video id ")
    if (!title || !videoDescription) throw new ApiError(404, "please enter all the fields ")

    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                title,
                videoDescription
            }
        },
        {
            new:true
        }
    )

    if(!updatedVideo) throw new ApiError(404, "videonot found")

    return res.status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"))
})

export {
    uploadVideo,
    getVideoById,
    updateVideoDetails
}