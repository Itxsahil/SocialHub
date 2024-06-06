import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../model/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHendler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    //TODO: create playlist
    if (!name || !description) throw new ApiError(200, "Pleas provide all the cridential")

    const createdPlayList = await Playlist.create({
        playlistName: name.toLowerCase(),
        description: description,
        owner: req.user._id
    })
    if (!createdPlayList) throw new ApiError(201, "Somthing went wrong while creatinng the playlist")

    return res.status(201)
        .json(new ApiResponse(
            201,
            createdPlayList,
            "PlayList created Successfully.."
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    if (!userId) throw new ApiError(400, "please provide all the creadiential")
    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user id")
    const playLists = await Playlist.find({ owner: userId }).select("-video")
    if(!playLists) throw new ApiError(404, "playList not found")
    return res.status(200)
        .json(new ApiResponse(
            200,
            playLists,
            "PlayLists fached sucessfully..."
        )
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    if(!playlistId) throw new ApiError(400, "Please provide all the cridiential")
        if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id")
    const playList = await Playlist.findById(playlistId)
    if(!playList) throw new ApiError(404, "Playlist not found")
    return res.status(200)
        .json(new ApiResponse(
            200,
            playList,
            "Playlist found Successfully"
        )
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if(!playlistId || !videoId) throw new ApiError(400, "Please provide all the cridential")
    if(!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id")
    const playList = await Playlist.findOne({
        _id : playlistId,
        owner : req.user._id
    })
    if(!playList) throw new ApiError(404, "Playlist not found")
    if (!playList.video.includes(videoId)) {
            playList.video.push(videoId)
            await playList.save()
        }
    
    return res.status(200)
        .json(new ApiResponse(
            200, 
            playList, 
            "Video added to playlist successfully"
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    if(!playlistId || !videoId) throw new ApiError(400, "Please provide all the cridential")
    if(!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id")
    const playList  = await Playlist.findById({
        _id: playlistId,
        owner : req.user._id
    })
    if(!playList) throw new ApiError(400, "PlayList not found")
    playList.video = playList.video.filter(id => id.toString() !== videoId)
    await playList.save()
    return res.status(200)
        .json(new ApiResponse(
            200, 
            playList, 
            "Video removed from playlist successfully"
        )
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if(!playlistId) throw new ApiError(400, "Pleasre provide Playlist Id")
    if(!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid Playlist Id")
    const playList = await Playlist.findByIdAndDelete(playlistId)
    if(!playList) throw new ApiError(404, "Playlist not found")
    return res.status(200)
        .json(new ApiResponse(
            200,
            {},
            "playlist deleted successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
    if(!playlistId) throw new ApiError(400, "Please provide Playlist id")
    if(!name) throw new ApiError(400, "Please provide Playlist name")
    if(!description) throw new ApiError(400, "Please provide Playlist description")
    if(!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id")
    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner : req.user._id
        },
        {
            playlistName : name,
            description : description
        },
        {
            new : true
        }
    )
    if(!updatedPlaylist) throw new ApiError(404, "PlayList not found")
    return res.status(200)
        .json(new ApiResponse(
            200,
            updatedPlaylist,
            "PlayList updated sucessfully"
        ))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}