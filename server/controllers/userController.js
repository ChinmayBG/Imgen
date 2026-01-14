import userModel from "../models/userModel.js";
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js";

// function for user registration 
const userRegister = async (req,res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" })
    }

    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)
    
    const userData = { 
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
    
    res.json({ success: true, token, user: { name: user.name } })
     
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const userLogin = async (req,res) => {
  
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    // if user not exits login is not possible
    if (!user) {
      return res.json({success:false , message:"User doesnt exist"})
    }

    //if user exists then we check for password 
    const isMatch = await bycrypt.compare(password, user.password)
    
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      
      res.json({success:true,token,user:{name:user.name}})
    } else {
      return res.json({success:false,message:"Invalid credentials"})
    }
    
  } catch (error) {
    console.log(error)
    res.json({success:false , message:error.message})
  }  
} 

//controller function for credits
const userCredits = async (req,res) => {
  try {
    const userId = req.user.id 
    
    //find user with given userId 
    const user = await userModel.findById(userId)

    res.json({success:true,credits:user.creditBalance,user:{name:user.name}})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

//handling payment gateway using razorpay 

//creating one instance for razor pay 
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
})

//making controller function to make payments
const paymentRazorPay = async(req,res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!userId || !planId) {
      return res.json({success:false , message:"Missing Details"})
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    //if we have both userId and planId then we simply do is find credits,plan,amount, date
    // from below switch case we will get credits,plan,amount 
    //now find date
    let credits, plan, amount;
    
    switch (planId) {
      case 'Basic':
        plan= "Basic"
        credits=100
        amount=10
        break;
      
      case 'Advanced':
        plan= "Advanced"
        credits= 500
        amount=50
        break;
      
      case 'Business':
        plan= "Business"
        credits= 5000
        amount=250
        break;
    
      default:
        return res.json({success:false,message:"Plan Not Found"});
    }
    const date = Date.now();

    const transactionData = {
      userId,plan,amount,credits,date
    }

    //to store this transactionData in mongodb database we create transactionSchema model in models folder
    const newTransaction = await transactionModel.create(transactionData)

    //whenever we create transaction in database's transasctionModel each transaction has its unique id 
    //this unique id is passed in receipt parameter
    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString(),
    }

    //here we will have either error or order
    const order = await razorpayInstance.orders.create(options);
    res.json({success:true,order})
    
  } catch (error) {
    console.log(error)
    res.json({success:false , message:error.message})
  }

}
const verifyRazorpay = async (req,res) => {
  try {
    const { razorpay_order_id } = req.body
    
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    
    if (orderInfo.status==='paid') {
      const transactionData = await transactionModel.findById(orderInfo.receipt)
      if (transactionData.payment) {
        return res.json({ success: false,message:"Payment Failed" })
      }
      const userData = await userModel.findById(transactionData.userId)
      
      //current credits +  credits added after plans
      const creditBalance = userData.creditBalance + transactionData.credits
      await userModel.findByIdAndUpdate(userData._id,{creditBalance})

      //right now we are using fake payment success
      //here we update transactionModel payment:true
      await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })
      
      res.json({success:true , message:"Credits added"})
    } else {
      res.json({success:false , message:"Transaction Failed"})
    }
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export {userRegister,userLogin,userCredits,paymentRazorPay,verifyRazorpay}