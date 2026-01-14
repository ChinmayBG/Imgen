import mongoose from "mongoose";
//  const transactionData = {
//       userId,plan,amount,credits,date
//  }
const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required:true
  }, 
  plan: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    default:5,
  },
  payment: {
    type: Boolean,
    default:false,
  },
  date: {
    type: Number,
  }
})

const transactionModel = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default transactionModel;