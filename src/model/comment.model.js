import mongoose, { Schema, Types, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema = new Schema(
    {
        comment:{
            type:String,
            required:true
        },
        videoId:{
            type:Types.ObjectId,
            ref:"Video"
        },
        owner:{
            type:Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps: true
    }
)

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = model("Comment", commentSchema)