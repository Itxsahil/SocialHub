import mongoose, { Schema, Types, model } from "mongoose";


const likeSchema = new Schema(
    {
        video:{
            type:Types.ObjectId,
            ref:"Video"
        },
        comment:{
            type:Types.ObjectId,
            ref:"Comment"
        },
        tweet:{
            type:Types.ObjectId,
            ref:"Tweet"
        },
        likedby:{
            type:Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

export const Likes = model("Likes",likeSchema)