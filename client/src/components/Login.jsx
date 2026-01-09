import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Login = () => {

  const [state, setState] = useState("Sign Up")
  const { setShowLogin } = useContext(AppContext);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [])
  
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
        <p className='text-sm'>Welcome back!Please sign up to continue</p>

        {state !== "Login" &&
          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
          <img width={22} src={assets.profile_icon} alt="" />
          <input type="text" placeholder='Full Name' className='text-sm outline-none' required />
        </div>
        }
        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
          <img  src={assets.email_icon} alt="" />
          <input type="email" placeholder='Email' className='text-sm outline-none'required />
        </div>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
          <img  src={assets.lock_icon} alt="" />
          <input type="password" placeholder='Password' className='text-sm outline-none'required />
        </div>

        <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forget Password</p>

        <button className='bg-blue-600 w-full text-white py-2 rounded-full '>{state==="Sign Up" ? 'Create Account' : "Login" }</button>

        <p className='mt-5 text-center'>{state === "Login" ? "Don't have an Account?" : "Already have an account?"}<span onClick={()=>setState(state==="Login" ? "Sign Up" : "Login")} className='text-blue-600 cursor-pointer'>{state === "Login" ? "Sign Up" :"Login"}</span> </p>

        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' />
        
      </form>   
    </div>
  )
}

export default Login
