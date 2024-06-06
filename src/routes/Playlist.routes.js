import { Router } from "express";
import {verifyJWT} from "../middlewares/Auth.middleware.js"

const router = Router()

import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"





router.route("/createPlaylist").post(verifyJWT,createPlaylist)
router.route("/allPlaylists/:userId").get(verifyJWT,getUserPlaylists)
router.route("/playlist/:playlistId").get(verifyJWT,getPlaylistById)
router.route("/addVideoToPlaylist/:playlistId/:videoId").post(verifyJWT,addVideoToPlaylist)
router.route("/removeVideoFromPlaylist/:playlistId/:videoId").post(verifyJWT,removeVideoFromPlaylist)
router.route("/deletePlaylist/:playlistId").post(verifyJWT,deletePlaylist)
router.route("/updatePlaylist/:playlistId").post(verifyJWT,updatePlaylist)



export default router