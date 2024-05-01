import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const PostSchema = new Schema({
  _id: ObjectId,
  date: String,
  upvotes: [String],
  downvotes: [String],
  ipAddress: String,
  content: String,
  hashtags: [String],
  reviewed: Boolean,
  canceled: Boolean,
});

const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;
