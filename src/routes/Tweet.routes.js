import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {createTweet,getUserTweets} from "../controllers/Tweet.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/tweet").post(verifyJWT,upload.single("image"),createTweet)
router.route("/:ownerId").get(getUserTweets)

export default router;