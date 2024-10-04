import React from "react";
import "./ViewCustomerModal.css"; // Importing CSS
import { Card, IconButton, Typography, Box, Button } from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

const ViewCustomerModal = ({ closeViewModal, activeUser }) => {
  const { locations } = useSelector((state) => state.location);

  // Find preferred location
  const preferredLocation = locations.find(
    (location) => location.id === activeUser.profile?.preferred_location
  );

  return (
    <Card className="viewcustomer-modal-card">
      {/* Close Button */}
      <IconButton className="viewcustomer-close-button" onClick={closeViewModal}>
        <CloseIcon />
      </IconButton>

      <Box className="viewcustomer-user-details">
        <div className="viewcustomer-section">
          {/* <Typography variant="h6" className="viewcustomer-section-title">
            User Information
          </Typography> */}

          <div className="viewcustomer-grid">
            {/* Left Side Information */}
            <div className="viewcustomer-left">
              {/* Name */}
              <div className="viewcustomer-left-right">
                <Typography variant="body2" className="viewcustomer-info-label">
                  Name:
                </Typography>
                <Typography variant="body2" className="viewcustomer-info-value">
                  {activeUser.profile?.firstName + " " + activeUser.profile?.lastName}
                </Typography>
              </div>


               {/* Address */}
              <div className="viewcustomer-left-right">
                <Typography variant="body2" className="viewcustomer-info-label">
                  Address:
                </Typography>
                <Typography variant="body2" className="viewcustomer-info-value">
                  {activeUser.profile?.address}
                </Typography>
              </div>
              

              {/* Phone Number */}
              <div className="viewcustomer-left-right">
                <Typography variant="body2" className="viewcustomer-info-label">
                  Phone Number:
                </Typography>
                <Typography variant="body2" className="viewcustomer-info-value">
                  {activeUser.profile?.phone_number}
                </Typography>
              </div>
            </div>

            {/* Right Side Information */}
            <div className="viewcustomer-right">
              {/* Role */}
              <div className="viewcustomer-left-right">
                <Typography variant="body2" className="viewcustomer-info-label">
                  Role:
                </Typography>
                <Typography variant="body2" className="viewcustomer-info-value">
                  {activeUser.user?.role}
                </Typography>
              </div>

              

              {/* Email */}
              <div className="viewcustomer-left-right">
                <Typography variant="body2" className="viewcustomer-info-label">
                  Email:
                </Typography>
                <Typography variant="body2" className="viewcustomer-info-value">
                  {activeUser.user?.email}
                </Typography>
              </div>

              {/* Post Code */}
              <div className="viewcustomer-left-right">
                <Typography variant="body2" className="viewcustomer-info-label">
                  Post Code:
                </Typography>
                <Typography variant="body2" className="viewcustomer-info-value">
                  {activeUser.profile?.post_code}
                </Typography>
              </div>

              {/* Gender */}
              <div className="viewcustomer-left-right">
                <Typography variant="body2" className="viewcustomer-info-label">
                  Gender:
                </Typography>
                <Typography variant="body2" className="viewcustomer-info-value">
                  {activeUser.profile?.gender}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons for Minutes Balance and Total Spent */}
        <div className="viewcustomer-buttons">
          <Button
            variant="contained"
            className="viewcustomer-button viewcustomer-minutes-button"
          >
            Minutes Balance: {activeUser.profile?.available_balance || 0}
          </Button>

          <Button
            variant="contained"
            className="viewcustomer-button viewcustomer-spent-button"
          >
            Total Spent: £{activeUser.profile?.total_spend?.toFixed(2) || 0}
          </Button>
        </div>
      </Box>
    </Card>
  );
};

export default ViewCustomerModal;
