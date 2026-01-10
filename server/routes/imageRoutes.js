import express from 'express'
import { generateImage } from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

// generateImage controller function requires userId from reqbody 
//using userAuth middleware we can do that 

imageRouter.post('/generate-image', userAuth, generateImage)

export default imageRouter;

 