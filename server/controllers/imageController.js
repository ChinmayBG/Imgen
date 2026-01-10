import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
  try {
    
    //in the body we send token from which we will extract userId 
    //then we will find user using userModel with that Id we found
    const userId = req.user.id;
    const { prompt } = req.body;

    const user = await userModel.findById(userId);

    if (!user || !prompt) {
      return res.json({success:false , message:"Missing Details"})
    }
    if (user.creditBalance === 0 || userModel.creditBalance < 0) {
      return res.json({success:false , message:"No credit balance",creditBalance:user.creditBalance})
    }

    const formData = new FormData();
    formData.append("prompt", prompt)
    
    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData,
      {
      headers: {
        'x-api-key':process.env.CLIPDROP_API,
      },
      responseType:'arraybuffer'
      })

    const base64Image = Buffer.from(data, 'binary').toString('base64')
    const resultImage = `data:image/png;base64,${base64Image}`
    
    await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })
    
    //after this we reduce the credits in the model and also send it to frontend response
    res.json({success:true , message:"Image Generated", credit:user.creditBalance-1 , resultImage}) 

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}