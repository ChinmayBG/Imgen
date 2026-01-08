//In AppContext we will store all states,variables,function so that we can use it in any component 
import { createContext, useState } from 'react'
// user is null initially than is not logged in

  
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(false);

  const value = {
    user,setUser
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
  
}

export default AppContextProvider;