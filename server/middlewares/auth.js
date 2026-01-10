import jwt from 'jsonwebtoken'

// we will create middleware functions here
const userAuth = async (req,res,next) => {
  
  //we will get token from req's header
  const { token } = req.headers;

  if (!token) {
    return res.json({success:false , message:"Token Unauthorised.Login Again"})
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
    
    if (tokenDecode.id) {
      req.user = { id: tokenDecode.id };
    } else {
      return res.json({success:false , message:"Not authorised.Login Again"})
    }

    next();

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
  
}

export default userAuth;