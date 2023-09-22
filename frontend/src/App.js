import './App.css';
import Dashboard from "./components/views/Dashboard";
import {createContext, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Manager from "./components/views/Manager";
import LanguageSwitcher from "./components/LanguageSwitcher";
import {useTranslation} from "react-i18next";

export const AuthContext = createContext()
export const UserDetailsContext = createContext()

export const LanguageContext = createContext()
function App({ i18n }) {
  const [isAuth, setIsAuth] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [ email, setEmail ] = useState("")
  const [ name, setName ] = useState("")
  const [ language, setLanguage ] = useState("english")
  const { t } = useTranslation()



  const handleLanguageChange = (language) => {
      i18n.changeLanguage(language)
          .then(() => setLanguage(language))
          .catch(error => console.error("Language change failed: ", error))
  }

  return (
      <AuthContext.Provider value={ {isAuth, setIsAuth} }>
          <UserDetailsContext.Provider value={{isManager, setIsManager, email, setEmail, name, setName}}>
              <LanguageContext.Provider value={{language, setLanguage, handleLanguageChange, t }}>
                  <LanguageSwitcher/>

                  <BrowserRouter>
                      <Routes>
                          <Route index element={isAuth ? <Dashboard/> : <Login/>}/>
                          <Route path='/login' element={isAuth ? <Navigate to='/dashboard'/> : <Login/>}/>
                          <Route path='/register' element={isAuth ? <Navigate to='/dashboard'/> : <Register/>}/>

                          <Route path='/dashboard' element={isAuth ? <Dashboard/> : <Navigate to='/login'/>}/>
                          <Route path='/manager' element={
                              isAuth
                                  ? isManager
                                      ? <Manager/>
                                      : <Navigate to='/dashboard'/>
                                  : <Navigate to='/login'/>}/>
                          <Route path="*" element={isAuth ? <Dashboard/> : <Login/>}/>
                      </Routes>
                  </BrowserRouter>
              </LanguageContext.Provider>

          </UserDetailsContext.Provider>

      </AuthContext.Provider>

  );
}

export default App;
