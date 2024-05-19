import { Request, Response } from "express";
import PostModel from "../models/Post";
import mongoose from "mongoose";


export const fetchPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const hashtag = req.query.q as string;
  const userIpAddress = req.query.ip as string;

  let query: any = {
    /* This query object ensures that only posts 
      that are either reviewed or belong to the current 
      user's IP address are included. */
    canceled: false,
    // $or: [
    //   { reviewed: true },
    //   { ipAddress: userIpAddress }
    // ]
  };
  if (hashtag) {
    query.hashtags = { $in: [hashtag] };
  }

  try {
    const paginatedResult = await PostModel.paginate(query, { page, limit });

    // Return the paginated result
    res.json(paginatedResult);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

export const cancelPost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    // Update the canceled field to true for the given post ID
    const result = await PostModel.findByIdAndUpdate(postId, { canceled: true }, { new: true });
    //  The { new: true } option ensures that the returned document is the updated one.

    // Check if the post was found and updated
    if (!result) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Return the updated post
    res.json(result);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error canceling post', error });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { content, ipAddress } = req.body;
  if (!content) {
    return;
  }

  // Create a new post instance
  const newPost = new PostModel({
    _id: new mongoose.Types.ObjectId(),
    date: new Date().toLocaleDateString("en-US"),
    hashtags: content.match(/#\w+/g) || [],
    ipAddress: ipAddress,
    content,
    upvotes: [],
    downvotes: [],
    reviewed: false,
    canceled: false,
  });

  try {
    // Save the new post to the database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
};