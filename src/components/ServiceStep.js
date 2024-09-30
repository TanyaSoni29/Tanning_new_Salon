import React from "react";
import "./LocationStep.css"; // Import the CSS file
import HeaderWithSidebar from "./HeaderWithSidebar";

const ServiceStep = () => {
  return (
    <>
    <HeaderWithSidebar />
    <div className="wizard-container">
      <h2 className="heading">Tanning Salon</h2>
      <p className="subheading">This information will let us know more about you.</p>

      <div className="step-tabs">
        <button href="/" className="tab">LOCATION</button>
        <button className="tab">ABOUT</button>
        <button className="tab active">SERVICE</button>
      </div>

      <div className="service-info">
        <h3 className="info-heading">Select Your Service</h3>
        {/* Add your service selection form fields here */}
      </div>

      <button className="submit-button">Submit</button>
    </div>
    </>
  );
};

export default ServiceStep;
