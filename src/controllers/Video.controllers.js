import { asyncHandler } from "../utils/asyncHendler.js";
import { Video } from "../model/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.uploade.js";
import { deleteFromeCloudinary } from "../utils/Cloudinary.delete.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async (req, res) => {

    //1- take all the data from user
    // 2-destr. those data// 2-destr. those data
    // 3-check required fields are present or not
    const { title, videoDescription, isPublished } = req.body
    if (!title) throw new ApiError(400, "Title is required..")
    if (!videoDescription) throw new ApiError(400, "videoDescription is required..")
    if (!isPublished) isPublished = true
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
        duration: videoLink.duration,
        isPublished
    })
    // 7-return the res to the user
    const UploadedVideo = await Video.findById(videoData._id).select("-isPublished")

    if (!UploadedVideo) throw new ApiError(400, "Somthing went wrong while Uploading the video")
    return res.status(200)
        .json(new ApiResponse(200, UploadedVideo, "Video is uploaded successfully"))

})
const getVideoList = asyncHandler(async (req, res) => {
    const video = await Video.find()
        .sort({ createdAt: -1 })
        .limit(10)
    return res.status(200)
        .json(new ApiResponse(200, video, "ok"))
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(404, "provide a valid video Id")

    const video = await Video.findById({ _id: videoId })
    if (!video) throw new ApiError(401, " video not found")
    if (video.isPublished !== true) throw new ApiError(401, "video is private")

    return res.status(200)
        .json(new ApiResponse(200, video, "Video fatched successfully"))
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, videoDescription } = req.body
    if (!videoId) throw new ApiError(404, "Please provide a video id ")
    if (!title || !videoDescription) throw new ApiError(404, "please enter all the fields ")
    const updatedVideo = await Video.findById(videoId)
    if (!updatedVideo) throw new ApiError(404, "video not found")
    if (String(updatedVideo.videoOwner) !== String(req.user._id)) throw new ApiError(404, "you are not he video owner")

    const afterupdatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                title,
                videoDescription
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json(new ApiResponse(200, afterupdatedVideo, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(404, "Please enter a valid videoId")

    const videoToBeDeleated = await Video.findById(videoId)
    const video_url = videoToBeDeleated?.videoLink
    const thumbnail_url = videoToBeDeleated?.thumbnail
    if (!videoToBeDeleated) throw new ApiError(404, "video not found")
    if (String(videoToBeDeleated.videoOwner) !== String(req.user._id)) throw new ApiError(404, "you are not the video owner")

    const VideoIsDeleated = await Video.findByIdAndDelete(videoId)
    console.log(VideoIsDeleated)
    if (!VideoIsDeleated) throw new ApiError(404, "video not found")
    await deleteFromeCloudinary(thumbnail_url, "image");
    await deleteFromeCloudinary(video_url, "video");
    console.log(" video is deleated")
    return res.status(200)
        .json(new ApiResponse(200, [], "video is deleated successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) throw new ApiError(401, "Give a  VideoId")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "video not found")
    if (String(video.videoOwner) !== String(req.user._id)) throw new ApiError(404, "you are not the video owner")
    video.isPublished = !video.isPublished
    const videoToggled = await video.save()

    return res.status(200)
        .json(new ApiResponse(201, videoToggled, "Publish status toggled successfully"))
})

export {
    uploadVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus,
    getVideoList
}