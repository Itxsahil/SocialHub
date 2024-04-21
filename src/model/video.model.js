import mongoose, { Schema, Types, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoLink: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        videoOwner: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        videoDescription: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        duration:{
            type:Number,
            required:true
        }
    },
    {

        timestamps: true,
    }
);

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = model("Video", videoSchema);
