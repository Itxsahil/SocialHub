import { Router } from "express";
import {
    loginUser, logoutUser, registerUser, refreshAccessToken, ChangePassword,getCurrentUser,updateUserDetails,updateAvatar,updateCoverImage,
} from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";


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

export default router;