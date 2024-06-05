import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../model/User.model.js"
import { Subscription } from "../model/Subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHendler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    if (!channelId) throw new ApiError(400, "Pleas provide a channnel id")
    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id")
    const existingPair = await Subscription.findOne({
        subscriber: req.user?._id, channel: channelId
    })
    if (existingPair) {
        await Subscription.findOneAndDelete({
            subscriber: req.user._id,
            channel: channelId
        })
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "channel unsubscribed"
                )
            )
    } else {
        const subscribed_ = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    subscribed_,
                    "channel subscribed"
                )
            )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) throw new ApiError(400, "Please provide a channel id")
    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id")
    const subscribers = await Subscription.find({ channel: channelId })
    if (!subscribers) throw new ApiError(404, "channel not found")
    return res.status(200)
        .json(new ApiResponse(
            200,
            subscribers,
            "subscribers found"
        )
        )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) throw new ApiError(400, "Please provide a subscriber id")
    if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber id")
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                subscriptions,
                "Subscribed channels retrieved successfully"
            )
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}