import mongoose, { Schema, Types, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const PlaylistSchema = new Schema(
    {
        playlistName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        video: [
            {
                type: Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {
            type: Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

PlaylistSchema.plugin(mongooseAggregatePaginate)

export const Playlist = model("Playlist", PlaylistSchema)