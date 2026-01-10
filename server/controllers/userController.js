import userModel from "../models/userModel.js";
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Model } from "mongoose";

// function for user registration 
const userRegistration = async (req,res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" })
    }

    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)
    
    const userData = {
      user,
      email,
      password: hashedPassword
    }

    const newUser = new Model(userData);
    const user = await newUser.save();

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
    
    res.json({ success: true, token, user: { name: user.name } })
     
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const loginUser = async () => {
  
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    // if user not exits login is not possible
    if (!user) {
      return res({success:false , message:"User doesnt exist"})
    }

    //if user exists then we check for password 
    const isMatch = await bycrypt.compare(password, user.password)
    
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      
      res.json({success:true,token,user:{name:user.name}})
    } else {
      return res({success:false,message:"Invalid credentials"})
    }
    
  } catch (error) {
    console.log(error)
    res.json({success:false , message:error.message})
  }  
} 