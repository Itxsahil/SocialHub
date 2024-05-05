import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { toggleVideoLike } from "../controllers/Likes.controller.js";

const router = Router()

router.route("/like/:videoId").post(verifyJWT,toggleVideoLike)



export default router