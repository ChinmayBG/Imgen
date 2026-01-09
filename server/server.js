import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'

const PORT = process.env.PORT || 4000

const app = express();

app.use(cors())
app.use(express.json())

//calling function to conneect mongodb database with express app
await connectDB();

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(PORT, () =>
  console.log("Server running on PORT " + PORT)
);