import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from './Home.module.css'



import FAQ from '../../components/FaqSection/FAQ'
import Hero from '../../components/HeroSection/Hero'
import Process from '../../components/ProcessSection/Process'
import Project from '../../components/ProjectSection/Project'
import Services from '../../components/ServicesSection/Services'
import TrainingSection from '../../components/TrainingSection/TrainingSection'
import WhyUs from '../../components/WhyUsSection/WhyUs'
import About from '../../pages/About/About'
import Contact from '../../pages/Contact/Contact'
import OurTeam from "../../components/OurTeamSection/OurTeamSection";



const Home =()=>{


    const location = useLocation();

  useEffect(() => {
    const hash = location.hash;

    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const scrollToSection = () => {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // Wait until the page/sections are rendered
    const timer = setTimeout(scrollToSection, 100);

    return () => clearTimeout(timer);
  }, [location.hash]);




    return (
        <>
               <Hero />
               <About />
               <Services />
               <WhyUs />
               <Process />
               <Project/>
               <OurTeam/>
               <TrainingSection />
               <FAQ />
               <Contact/>
        </>
    )
}

export default Home