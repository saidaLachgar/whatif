import { Request, Response } from "express";
import Post from "../models/Post";

export const fetchPosts = async (req: Request, res: Response) => {
  const posts = await Post.find();
  res.json(posts);
};

// export default { fetchPosts }