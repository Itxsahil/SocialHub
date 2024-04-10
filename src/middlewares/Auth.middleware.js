import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHendler.js";
import jwt from "jsonwebtoken";
import { User } from "../model/User.model.js";


const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) throw new ApiError(401, "unauthorized request")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) throw new ApiError(401, "Invalid Access Token")

        req.user = user;
        // After varify the user we just add a new object i.e "user" in request parameter
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

export { verifyJWT }