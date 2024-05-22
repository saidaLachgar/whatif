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
    $or: [
      { reviewed: true },
      { ipAddress: userIpAddress }
    ]
  };
  if (hashtag) {
    query.hashtags = { $in: [`#${hashtag}`] };
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

export const votePost = async (req: Request, res: Response) => {
  const { up, ipAddress } = req.body;
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const indexInUpvotes = post.upvotes.indexOf(ipAddress);
    const indexInDownvotes = post.downvotes.indexOf(ipAddress);

    if (up) {
      // If user already upvoted, remove it
      if (indexInUpvotes !== -1) {
        post.upvotes.splice(indexInUpvotes, 1);
      } else {
        // If user downvoted, remove it from downvotes array
        if (indexInDownvotes !== -1) {
          post.downvotes.splice(indexInDownvotes, 1);
        }
        // Add user's IP to upvotes array
        post.upvotes.push(ipAddress);
      }
    } else {
      // If user already downvoted, remove it
      if (indexInDownvotes !== -1) {
        post.downvotes.splice(indexInDownvotes, 1);
      } else {
        // If user upvoted, remove it from upvotes array
        if (indexInUpvotes !== -1) {
          post.upvotes.splice(indexInUpvotes, 1);
        }
        // Add user's IP to downvotes array
        post.downvotes.push(ipAddress);
      }
    }

    // Save the updated post
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error while processing vote:', error);
    res.status(500).json({ error: 'An error occurred while processing the vote.' });
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

export const topHashtags = async (req: Request, res: Response) => {
  const userIpAddress = req.query.ip as string;
  try {
    const topHashtags = await PostModel.aggregate([
      {
        $match: {
          canceled: false,
          $or: [
            { reviewed: true },
            { ipAddress: userIpAddress }
          ]
        }
      }, // Filter only reviewed posts
      /* $unwind: Deconstructs the hashtags array field from the input 
        documents to output a document for each element. 
        */
      { $unwind: "$hashtags" },
      /* $group: Groups the documents by hashtag. In the grouping stage, we:
        Use $sum to count the occurrences of each hashtag.
        Use $addToSet to collect unique post IDs associated with each hashtag.
        */
      {
        $group: {
          _id: "$hashtags",
          count: { $sum: 1 },
          postIds: { $addToSet: "$_id" }
        }
      },
      /* $project: Creates a new field postCount which uses $size to count 
        the number of unique post IDs for each hashtag.*/

      {
        $project: {
          _id: 1,
          count: 1,
          // postCount: { $size: "$postIds" }
        }
      },
      // $sort: Sorts the documents by the count in descending order.
      { $sort: { count: -1, _id: 1 } },
      // $limit: Limits the results to the top 10 hashtags.
      { $limit: 13 },
    ]);

    res.json(topHashtags);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching top hashtags.' });
  }
};

export const searchHashtags = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const suggestions = await PostModel.aggregate([
      { $unwind: "$hashtags" },
      {
        $match: {
          hashtags: { $regex: `^#${query}`, $options: 'i' }
        }
      },
      {
        $group: {
          _id: "$hashtags",
          count: { $sum: 1 },
          postIds: { $addToSet: "$_id" }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          postCount: { $size: "$postIds" }
        }
      },
      { $limit: 10 }
    ]);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching hashtag suggestions.' });
  }
};
