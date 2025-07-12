import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";
import AuthProvider from "../Contexts/AuthProvider";
import AOS from 'aos';

const Root = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
      offset: 50,
      delay: 0,
    });
  }, []);

  return (
    <AuthProvider>
      <div>
        <div>
          <Navbar></Navbar>
        </div>
        <div className="min-h-80">
          <Outlet></Outlet>
        </div>
        <div>
          <Footer></Footer>
        </div>
      </div>
    </AuthProvider>
  );
};

export default Root;
