//In AppContext we will store all states,variables,function so that we can use it in any component 
import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
// user is null initially than is not logged in
export const AppContext = createContext();

const AppContextProvider = (props) => {
const [user, setUser] = useState(false);
const [showLogin, setShowLogin] = useState(false);
const [token, setToken] = useState(localStorage.getItem('token'))
const [credit, setCredit] = useState(null)

const backendUrl = import.meta.env.VITE_BACKEND_URL
   
  
const loadCreditsData = async () => {
  try {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) return;

    const { data } = await axios.get(
      backendUrl + "/api/user/credits",
      {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      }
    );

    if (data.success) {
      setCredit(data.credits);
      setUser(data.user);
    }

  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Auth error");
  }
};

  useEffect(() => {
    if (token) {
      loadCreditsData()
    }
  }, [token])

  //function to call generate image api 
const generateImage = async (prompt) => {
  try {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      toast.error("Please Login first")
      return null;
    }

    const { data } = await axios.post(backendUrl + '/api/image/generate-image', { prompt }, { headers: {
            Authorization: `Bearer ${storedToken}`
    }
    })
    
    if (data.success) {
      loadCreditsData()
      return data.resultImage
    } else {
      toast.error(data.message)
      return null
    }
    
    
  } catch (error) {
    toast.error(error.message)
  }
}  
  
const logout = () => {
  localStorage.removeItem("token"); 
  setToken("");
  setUser(null);
  setCredit(null);
};

  const value = {
    user,setUser,showLogin,setShowLogin,backendUrl,token, setToken,credit, setCredit,loadCreditsData,logout,generateImage
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
  
}

export default AppContextProvider;