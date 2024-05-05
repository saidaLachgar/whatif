import { Request, Response } from "express";
import PostModel from "../models/Post";


export const fetchPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const paginatedResult = await PostModel.paginate({}, { page, limit });

    // Return the paginated result
    res.json(paginatedResult);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// export default { fetchPosts }