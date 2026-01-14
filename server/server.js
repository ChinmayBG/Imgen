import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000

const app = express();

app.use(cors())
app.use(express.json())


//calling function to conneect mongodb database with express app
await connectDB();

app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);
 

app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(PORT, () =>
  console.log("Server running on PORT " + PORT)
);

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});