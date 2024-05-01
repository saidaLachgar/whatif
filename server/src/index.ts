import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import './db/conn'
import { fetchPosts } from "./controllers/postsController"

const PORT = process.env.PORT || 5050
const app = express()

app.use(
  cors({
    origin: [process.env.CLIENT_URL || '*'],
    // allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    methods: 'GET, PUT, POST',
    credentials: true
  }),
)
app.use(express.json())

app.get('/posts', fetchPosts)

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
