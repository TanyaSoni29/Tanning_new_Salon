import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LocationStep from "./components/LocationStep";
import AboutStep from "./components/AboutStep";
import ServiceStep from "./components/ServiceStep";
import AuthForm from './sign-in/AuthForm';



const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/locationStep" element={<LocationStep />} />
          <Route path="/about" element={<AboutStep />} />
          <Route path="/service" element={<ServiceStep />} />
        </Routes>
      </div>
    </Router>

    
  );
};

export default App;
