import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutStep.css"; // Ensure this CSS file is imported
import HeaderWithSidebar from "./HeaderWithSidebar";

const AboutStep = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/service");
  };

  const handlePrevious = () => {
    navigate("/");
  };

  return (
    <>
    <HeaderWithSidebar />
    <div className="wizard-container">
      <h2 className="heading">Tanning Salon</h2>
      <p className="subheading">This information will let us know more about you.</p>
      
      <div className="step-tabs">
        <button className="tab" onClick={() => navigate("/")}>LOCATION</button>
        <button className="tab active">ABOUT</button>
        <button className="tab" onClick={() => navigate("/service")}>SERVICE</button>
      </div>

      <div className="about-info">
        <h3 className="info-heading">Let's start with the basic information</h3>
        <label className="search-label">Search</label>
        <input
          type="text"
          className="search-input"
          placeholder="Search Customer"
        />
        <button className="register-button">REGISTER NEW CUSTOMER</button>
      </div>

      <div className="navigation-buttons">
        <button className="previous-button" onClick={handlePrevious}>PREVIOUS</button>
        <button className="next-button" onClick={handleNext}>NEXT</button>
      </div>
    </div>
    </>
  );
};

export default AboutStep;
