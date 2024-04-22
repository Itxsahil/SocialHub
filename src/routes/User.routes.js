import { Router } from "express";
import {
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    ChangePassword,
    getCurrentUser,
    updateUserDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
// import multer from "multer";


// uplaod is a middle ware of multer which help us to receve buffer data from the clint side

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

// secure routes

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, ChangePassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-userDetails").patch(verifyJWT, updateUserDetails)
router.route("/change-avatar").patch(verifyJWT,upload.single("avatar") ,updateAvatar)
router.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)

export default router;