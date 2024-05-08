import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { toggleCommentLike, toggleVideoLike,getLikedVideos } from "../controllers/Likes.controller.js";

const router = Router()

router.route("/video/:videoId").post(verifyJWT,toggleVideoLike)
router.route("/comment/:commentId").post(verifyJWT,toggleCommentLike)
router.route("/likedVideos").get(verifyJWT,getLikedVideos)



export default router