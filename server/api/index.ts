import cors from 'cors';
import 'dotenv/config';
import './db/conn';
import express, { Express, Request, Response } from "express";
import { fetchPosts, cancelPost, createPost } from './controllers/postsController';


/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */

const PORT: string = process.env.PORT || '5050';
const CORS: string = process.env.CLIENT_URL;
const APP: Express = express();

APP.set('trust proxy', true)

APP.use(
  cors({
    origin: [CORS],
    methods: 'GET, PUT, POST, PATCH',
    credentials: true
  }),
);

APP.use(express.json());


/* Define a route for the root path ("/")
 using the HTTP GET method */
APP.get("/", (req: Request, res: Response) => {
  res.send("API - 👋🌎🌍🌏");
});


/* Define app routes */
// app.get('/test-posts', testPosts)
// Route to get paginated posts with filter
APP.get('/posts', fetchPosts);
// Route to cancel a post by ID
APP.patch('/posts/:id/cancel', cancelPost);
// Route to create new post
APP.post('/posts', createPost);



/* Start the Express app and listen
 for incoming requests on the specified port */
APP.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT} 🚀`);
  console.log(`Allowed origines: ${CORS} 🤙🌎`);
})
