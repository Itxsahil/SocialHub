import { Schema, Types, model } from "mongoose";

const tweetSchema = new Schema(
    {
        content:{
            type:String,
            required:true
        },
        owner:{
            type:Types.ObjectId,
            ref:"User"
        },
        image:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

export const Tweet = model("Tweet", tweetSchema)