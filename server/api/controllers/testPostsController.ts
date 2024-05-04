import { Request, Response } from "express";
import Post from "../models/Post";

/*
*  *** INSERT DOCUMENTS ***
*
* You can insert individual documents using collection.insert().
* In this example, we're going to create four documents and then
* insert them all in one call with collection.insertMany().
*/
export const testPosts = async (req: Request, res: Response) => {
  console.log('helllo!!!');

  const isodate = new Date().toISOString()
  const posts = [
    {
      date: isodate,
      totalUpvotes: ["196.115.233.128", "145.1.141.105", "215.99.99.236", "29.226.253.28", "188.243.85.169", "49.73.191.47", "126.60.122.85", "66.70.81.159"],
      totalDownvotes: ["99.145.38.100", "4.33.250.7"],
      ipAddress: "196.115.233.128",
      content: "Post content here #hashtag1 #hashtag2, posted by me",
      hashtags: ["hashtag1", "hashtag2"],
      reviewed: true,
    },
    {
      date: isodate,
      ipAddress: "196.115.233.128",
      content: "Post content here #hashta4, with a single hastag, posted by me",
      hashtags: ["hashta4"],
      reviewed: true,
    },
    {
      date: isodate,
      ipAddress: "49.73.191.47",
      content: "Post content here without hash tags, posted by someone else",
      reviewed: true,
    },
    {
      date: isodate,
      ipAddress: "49.73.191.47",
      content: "Post content here without hash tags, posted by someone else, NOT REVIEWED",
    },
    {
      date: isodate,
      ipAddress: "49.73.191.47",
      content: "Post content here without hash tags, posted by someone else, CANCELED",
      canceled: true,
    },
  ];

  try {
    const insertManyResult = await Post.insertMany(posts);
    console.log(`${posts.length} documents successfully inserted.\n`, insertManyResult);
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
};