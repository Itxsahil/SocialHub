import { asyncHandler } from "../utils/asyncHendler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/User.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.uploade.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { deleteFromeCloudinary } from "../utils/Cloudinary.delete.js";
import mongoose from "mongoose";

const generateAccessRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const AccessToken = user.generateAcessToken();
        const RefreshToken = user.generateRfreshToken();
        user.refreshToken = RefreshToken;
        await user.save({ validateBeforeSave: false }); // validate before save help us to tackel required field cuz we dont want to change all the data fields before updating

        return { AccessToken, RefreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "somthing went wrong while generating Access and Refresh tokens"
        );
    }
}; // a method to generate access and refresh token which accepts the method to generate tokens which is designed in the user_model

const registerUser = asyncHandler(async (req, res) => {
    /*
          1- take all the data from user || from frontend 
          2- distructure all of data
          3- check is all data are avaliable if not then throw an error
          4- chec if user is already exist 
          5- check for buffer data
          6- is avaliable then upload in cloudinary
          7- creat an object 
          8- save all of data in db
          9- remove password and refresh token fron response
          10- check for user creation
          11- return response
          */
    const { username, fullname, password, email } = req.body;

    // console.log(req.body)

    if (!username) throw new ApiError(400, "Username is required..");
    if (!fullname) throw new ApiError(400, "fullname is required..");
    if (!password) throw new ApiError(400, "password is required..");
    if (!email) throw new ApiError(400, "email is required..");

    const existeduser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existeduser) throw new ApiError(409, "User is already exist");
    // console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path; // files is use to get an array of buffer
    // console.log(avatarLocalPath);
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) throw new ApiError(400, "Avatr file is required ");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) throw new ApiError(400, "cloudinary is not  working properly..");

    const user = await User.create({
        username,
        email,
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });
    // console.log(user)

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // select is a method that help us to remove the unwanted fieldes while querying the data from the db call "we have to pass all the fieldes that we dont want from the db with a - sign i a string formate.."

    if (!createdUser) {
        throw new ApiError(500, "Somthin went wrong while registring the user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User register successfully "));
});

const loginUser = asyncHandler(async (req, res) => {
    // take data from body
    // validate existing user by username or email
    // password check
    // generate access token and refresh token
    // send cookie

    const { username, email, password } = req.body;

    if (!username && !email)
        throw new ApiError(400, "Username or password is required");
    if (!password) throw new ApiError(400, "Password is required");

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) throw new ApiError(404, "User never exist");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new ApiError(404, "invalid Password");

    const { AccessToken, RefreshToken } = await generateAccessRefreshTokens(
        user._id
    );

    const loggedinUser = await User.findOne(user._id).select(
        "-password -refreshtoken"
    ); // select is a mongoose method which help us to remob=ve the unwanted fieldes from the data object

    const options = {
        httpOnly: true,
        secure: true,
    }; // it help us make our code secure

    return res
        .status(200)
        .cookie("AccessToken", AccessToken, options)
        .cookie("RefreshToken", RefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedinUser,
                    AccessToken,
                    RefreshToken,
                },
                "user logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            },
        },
        {
            new: true, // it gives the updated value of user in which we dont have the refreshToken valuse
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("AccessToken", options)
        .clearCookie("RefreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.RefreshToken || req.body.RefershToken

    if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request")

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) throw new ApiError(401, "Invalid refresh token")
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { AccessToken, newRefreshToken } = await generateAccessRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("AccessToken", AccessToken, options)
        .cookie("RefreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {AccessToken, RefreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const ChangePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, conformPassword } = req.body;

    if (newPassword !== conformPassword)
        throw new ApiError(401, "Enter a valid new password");

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid Password");

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    
    return res.status(200).json(new ApiResponse(200, req.user, "User fached successfully"));
    
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;
    if (!fullname || !email) throw new ApiError(400, "All fields are required");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated Successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path; // file is use for a single buffer data

    if (!avatarLocalPath) throw new ApiError(400, "Avatar file required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url)
        throw new ApiError(400, "Error while uploading on cloudinary");

    const url = req.user?.avatar;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true }
    ).select("-password");
    await deleteFromeCloudinary(url,"image");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar  updated Successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path; // file is use for a single buffer data

    if (!coverImageLocalPath) throw new ApiError(400, "Avatar file required");

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url)
        throw new ApiError(400, "Error while uploading on cloudinary");
    const url = req.user?.coverImage
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        { new: true }
    ).select("-password");
    await deleteFromeCloudinary(url, "image");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "CoverImage  updated Successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username?.trim()) throw new ApiError(400, "invalid url")

    const channel = await User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subcribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subcribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscriber"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscriber.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) throw new ApiError(404, "Channel does't exist")

    return res.status(200)
        .json(new ApiResponse(200, channel[0]), "User channel fached successfully")
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "videoOwner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            videoOwner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "watchHistory fatched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    ChangePassword,
    getCurrentUser,
    updateUserDetails,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
};
