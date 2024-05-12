import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {createTweet} from "../controllers/Tweet.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/tweet").post(verifyJWT,upload.single("image"),createTweet)

export default router;