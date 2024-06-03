import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {createTweet,getUserTweets,updateTweet,deleteTweet} from "../controllers/Tweet.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/tweet").post(verifyJWT,upload.single("image"),createTweet)
router.route("/all/:ownerId").get(getUserTweets)
router.route("/update-tweet/:tweetId").patch(verifyJWT,upload.single("image"),updateTweet)
router.route("/delete-tweet/:tweetId").delete(verifyJWT,deleteTweet)

export default router;