import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
    uploadVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo
} from "../controllers/Video.controllers.js";


const router = Router()

router.route("/upload-video").post(verifyJWT, upload.fields([
    {
        name: "video",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]),
    uploadVideo)

router.route("/:videoId").get(verifyJWT, getVideoById)
router.route("/videoDetails/:videoId").patch(verifyJWT, updateVideoDetails)
router.route("/deleatVideo/:videoId").delete(verifyJWT, deleteVideo)

export default router;