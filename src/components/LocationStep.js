import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LocationStep.css"; // Import the new CSS file
import HeaderWithSidebar from "./HeaderWithSidebar";

const WizardStep = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  
  // State to track the current step
  const [currentStep, setCurrentStep] = useState("location"); // Default to "location"

  // Set the current step based on the URL path
  useEffect(() => {
    if (location.pathname === "/about") {
      setCurrentStep("about");
    } else if (location.pathname === "/service") {
      setCurrentStep("service");
    } else {
      setCurrentStep("location");
    }
  }, [location.pathname]);

  const handleTabClick = (step) => {
    setCurrentStep(step); // Change the current step based on the clicked tab
    navigate(step === "location" ? "/" : `/${step}`); // Navigate based on step
  };

  const handleNextLocation = () => {
    setCurrentStep("about");
    navigate("/about");
  };

  const handleNextAbout = () => {
    setCurrentStep("service");
    navigate("/service");
  };

  const handlePreviousAbout = () => {
    setCurrentStep("location");
    navigate("/");
  };

  const handleSubmit = () => {
    alert("Form Submitted");
  };

  return (
    <>
        <HeaderWithSidebar />
    
    <div className="wizard-container">
    
      <h2 className="heading">Tanning Salon</h2>
      <p className="subheading">This information will let us know more about you.</p>

      {/* Step Tabs */}
      <div className="step-tabs">
        <button 
          className={`tab ${currentStep === "location" ? "active" : ""}`} 
          onClick={() => handleTabClick("location")}
        >
          LOCATION
        </button>
        <button 
          className={`tab ${currentStep === "about" ? "active" : ""}`} 
          onClick={() => handleTabClick("about")}
        >
          ABOUT
        </button>
        <button 
          className={`tab ${currentStep === "service" ? "active" : ""}`} 
          onClick={() => handleTabClick("service")}
        >
          SERVICE
        </button>
      </div>

      {/* Conditionally Render Sections Based on Current Step */}
      {currentStep === "location" && (
        <div className="location-selection" id="location">
          <h3 className="select-heading">Select Your Location</h3>
          <div className="locations">
            <div className="location">
              <i className="fa fa-laptop" aria-hidden="true"></i>
              <span>LOCATION 1</span>
            </div>
            <div className="location">
              <i className="fa fa-laptop" aria-hidden="true"></i>
              <span>LOCATION 2</span>
            </div>
            <div className="location">
              <i className="fa fa-laptop" aria-hidden="true"></i>
              <span>LOCATION 3</span>
            </div>
          </div>
          <button className="next-button1" onClick={handleNextLocation}>NEXT</button>
        </div>
      )}
    </div>
    </>
  );
};

export default WizardStep;
