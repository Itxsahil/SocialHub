import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { uploadVideo } from "../controllers/Video.controllers.js";


const router = Router()

router.route("/upload-video").post(verifyJWT,upload.fields([
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

export default router;