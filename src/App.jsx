import { useEffect } from "react";
import { Routes,Route ,useNavigate} from "react-router-dom";
import './Api/ApiIntersceptor'


import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Layout from "./Layout/Layout";
import Project from "./components/ProjectSection/Project";
import AdminDashbord from "./pages/AdminDashboard/AdminDashbord";

import SignupLogin from './Auth/SignupLogin'

// NAYE IMPORTS

import { setNavigate } from './Api/navigation';

export default function App() {
   const navigate = useNavigate()
 
   useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const OnClose = () => {
    navigate('/')
  }

  return (
    <>
      <Routes>

        <Route element ={<Layout/>}>
          <Route path="/" element={<Home/>} ></Route>
          <Route path="/about" element={<About/>} ></Route>
          <Route path="/contact" element={<Contact/>} ></Route>
          <Route path="/projects" element={<Project/>} ></Route>
        </Route>

        <Route path ='/admin' element ={<AdminDashbord></AdminDashbord>}> </Route>

        <Route path='/login' element={<SignupLogin close={OnClose} initialMode="login" />} ></Route>
        <Route path='/signup' element={<SignupLogin close={OnClose} initialMode="signup" />} ></Route>

      </Routes>
  
    </>
  );
}







