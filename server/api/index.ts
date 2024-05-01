import express, { Express, Request, Response } from "express";
import cors from 'cors';
import 'dotenv/config'
import './db/conn';
import { fetchPosts } from './controllers/postsController';


/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */

const PORT = process.env.PORT || 5050;
const app: Express = express();

console.log('ENVVVVVVVVVVVVVVVVVV', process.env.CLIENT_URL, process.env.ATLAS_URI);

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: 'GET, PUT, POST',
    credentials: true
  }),
)
app.use(express.json())


/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", (req: Request, res: Response) => {
  res.send("API - 👋🌎🌍🌏");
});


/* Define app routes */
app.get('/posts', fetchPosts)


/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT} 🚀`)
})
