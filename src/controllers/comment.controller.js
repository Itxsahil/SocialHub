import { asyncHandler } from "../utils/asyncHendler.js";
import { Comment } from "../model/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a video
	const { videoId } = req.params;
	if (!videoId) throw new ApiError(404, "VideoId required");
	const comments = await Comment.find().sort({ createdAt: -1 }).limit(10);
	if (!comments) throw new ApiError(404, "No comment found for this video"); return res
		.status(200)
		.json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	const { comment } = req.body;
	if (!comment) throw new ApiError(404, "comment could not be empty");
	if (!videoId) throw new ApiError(404, "unable to get video Id");
	const commented = await Comment.create({
		comment,
		videoId,
		owner: req.user._id,
	});
	if (!commented) throw new ApiError(400, "unable to comment on the video");

	return res
		.status(200)
		.json(new ApiResponse(201, commented, "comment uploaded sucessfully"));
});

const updateComment = asyncHandler(async (req, res) => {
	const { commentId, videoId } = req.params;
	const { comment } = req.body;
	if (!videoId) throw new ApiError(404, "provide a video id");
	if (!comment) throw new ApiError(400, "comment couldnot be empty");
	const findComment = await Comment.findOne({ _id: commentId, videoId });
	if (!findComment) throw new ApiError(500, " comment not found ");
	if (findComment.owner.toString() !== req.user._id.toString())
		throw new ApiError(400, "you are note the Owner");
	const updatedComment = await Comment.findByIdAndUpdate(
		commentId,
		{
			$set: {
				comment,
			},
		},
		{
			new: true,
		}
	);
	if (!updatedComment) throw new ApiError(500, "operation failed");
	return res
		.status(200)
		.json(new ApiResponse(200, updatedComment, "comment updated successfully"));
});

const deleteCommment = asyncHandler(async (req, res) => {
	const { commentId, videoId } = req.params;
	if (!commentId) throw new ApiError(404, "Provide a  CommentId..");
	const findComment = await Comment.findById(commentId);
	if (!findComment) throw new ApiError(404, "comment not found ");
	if (findComment.owner.toString() !== req.user._id.toString())
		throw new ApiError(404, "unauth request");
	await Comment.findByIdAndDelete(commentId);
	if (await Comment.findById(videoId))
		throw new ApiError(500, "somthing went wrong while deleting the comment ");
	return res
		.status(200)
		.json(new ApiResponse(201, "comment deleted Sucessfully"));
});

export { addComment, updateComment, getVideoComments, deleteCommment };
