import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  creditBalance: {
    type: Number,
    default:5,
  }
})

// creates a model that connects your backend code to the user collection in MongoDB, using the rules defined in userSchema.
//if already user model is present then second part which creates model it not necessary
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;