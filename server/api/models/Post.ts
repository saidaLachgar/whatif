import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';

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

interface PostData {
  date?: string;
  upvotes?: string[];
  downvotes?: string[];
  ipAddress?: string;
  content?: string;
  hashtags?: string[];
  reviewed?: boolean;
  canceled?: boolean;
}

// paginate with this plugin
PostSchema.plugin(paginate);

// declare a mongoose document based on a Typescript interface representing your schema
interface PostDocument extends mongoose.Document, PostData { }

// create the paginated model
const PostModel = mongoose.model<
  PostDocument,
  mongoose.PaginateModel<PostDocument>
>('Posts', PostSchema, 'posts');

export default PostModel;