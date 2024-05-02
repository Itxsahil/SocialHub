import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

import {
    addComment,
    updateComment,
    getVideoComments,
    deleteCommment
} from "../controllers/comment.controller.js"

const router = Router()

router.route("/:videoId/addComment").post(verifyJWT, addComment)
router.route("/:videoId/:commentId/updateComment").patch(verifyJWT, updateComment)
router.route("/:videoId/getVideoComments").get(getVideoComments)
router.route("/:commentId/deleteCommment").delete(verifyJWT,deleteCommment)

export default router