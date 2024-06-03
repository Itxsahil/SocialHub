import { Tweet } from "../model/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHendler.js"
import { deleteFromeCloudinary } from "../utils/Cloudinary.delete.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.uploade.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    const imageLocalPath = req.file?.path
    if (!content && !imageLocalPath) throw new ApiError(401, "Enter a valid msg")
    let imageUrl = "";
    if (imageLocalPath) {
        imageUrl = await uploadOnCloudinary(imageLocalPath)
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
        image: imageUrl.url
    })
    if (!tweet) throw new ApiError(400, "somthing went wrong while the operation")
    return res.status(200)
        .json(new ApiResponse(200, tweet, "Tweet is successfully done"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { ownerId } = req.params
    if (!ownerId) throw new ApiError(404, "provide a valid owner")
    let page = parseInt(req.query.page) || 1
    const pageSize = 10


    let tweets;
    let hasMore = true;
    while (hasMore) {
        // Fetch tweets for the current page
        tweets = await Tweet.find({ owner: ownerId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);


        // If no tweets found for this page, exit the loop
        if (tweets.length === 0) break;

        tweets.forEach(tweet => {
            res.write(`data: ${JSON.stringify(tweet)}\n\n`);
        });

        page++; // Move to the next page
        // Check if there are more tweets
        hasMore = tweets.length === pageSize;
    }
    res.end();
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    const imageLocalPath = req.file?.path;

    if (!content && !imageLocalPath) {
        throw new ApiError(401, "Please enter valid content or image");
    }

    
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "Unauthorized request");
    }

    let imageUrl = "";
    if (imageLocalPath) {
        const uploadResult = await uploadOnCloudinary(imageLocalPath);
        if (uploadResult && uploadResult.url) {
            imageUrl = uploadResult.url;
        } else {
            throw new ApiError(500, "Image upload failed");
        }
    }

    // const tweet = await Tweet.findById(tweetId);
    // if (!tweet) {
    //     throw new ApiError(404, "Tweet not found");
    // }

    

    const updateFields = {};
    if (content) {
        updateFields.content = content;
    }
    if (imageUrl) {
        updateFields.image = imageUrl;
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: updateFields },
        { new: true }
    );

    return res.status(200)
        .json(new ApiResponse(200, 
            updatedTweet, 
            "Tweet updated successfully"
        )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const {tweetId} = req.params

    if(!tweetId) throw new ApiError(401, "Pleas provide the tweetId")
        
    let tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "Unauthorized request");
    }
    
    tweet = await Tweet.findByIdAndDelete(tweetId)
    await deleteFromeCloudinary(tweet.image)
    return res.status(203)
        .json(
            new ApiResponse(204,
                {}, 
                "tweet deleted sucessfully"
            )
        )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}