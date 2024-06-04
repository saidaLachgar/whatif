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
  score: { type: Number, default: 0 },
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
  score?: number;
}

// paginate with this plugin
PostSchema.plugin(paginate);

// Create an index on the score field
PostSchema.index({ score: -1 });
PostSchema.methods.calculateScore = function () {
  const upvoteCount = (this.upvotes ?? []).length;
  const downvoteCount = (this.downvotes ?? []).length;
  const ageInHours = (Date.now() - new Date(this.date).getTime()) / 3600000;
  const score = upvoteCount - downvoteCount - ageInHours; // Example formula
  this.score = score;
};
PostSchema.pre('save', function (next) {
  PostSchema.methods.calculateScore();
  next();
});

// declare a mongoose document based on a Typescript interface representing your schema
interface PostDocument extends mongoose.Document, PostData {
  calculateScore(): void;
}

// create the paginated model
const PostModel = mongoose.model<
  PostDocument,
  mongoose.PaginateModel<PostDocument>
>('Posts', PostSchema, 'posts');

export default PostModel;