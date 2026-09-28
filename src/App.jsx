import { useEffect } from "react";
import { Routes,Route ,useNavigate} from "react-router-dom";
import './Api/ApiIntersceptor'


import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Layout from "./Layout/Layout";
import Project from "./components/ProjectSection/Project";
import RequireAdmin from "./Auth/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import AdminOverview from "./admin/modules/AdminOverview";
import InquiryManager from "./admin/modules/InquiryManager";
import CmsContentManager from "./admin/modules/CmsContentManager";
import CompanyEditor from "./admin/modules/CompanyEditor";
import FutureSettings from "./admin/modules/FutureSettings";
import { contentModules } from "./admin/modules/contentConfig";

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

        <Route path="/admin/*" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminOverview />} />
          <Route path="inquiries" element={<InquiryManager />} />
          <Route path="projects" element={<CmsContentManager config={contentModules.projects} />} />
          <Route path="team" element={<CmsContentManager config={contentModules.team} />} />
          <Route path="services" element={<CmsContentManager config={contentModules.services} />} />
          <Route path="faqs" element={<CmsContentManager config={contentModules.faqs} />} />
          <Route path="company" element={<CompanyEditor />} />
          <Route path="settings" element={<FutureSettings />} />
        </Route>

        <Route path='/login' element={<SignupLogin close={OnClose} initialMode="login" />} ></Route>
        <Route path='/signup' element={<SignupLogin close={OnClose} initialMode="signup" />} ></Route>

      </Routes>
  
    </>
  );
}







