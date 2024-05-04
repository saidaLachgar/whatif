import mongoose from 'mongoose'

const connectionString = process.env.ATLAS_URI || ''

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB 🍃✨')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error)
  })
