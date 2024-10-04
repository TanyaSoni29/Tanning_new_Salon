import React from "react";
import "./ViewCustomerModal.css"; // Importing CSS
import { Card, IconButton, Typography, Box, Button } from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

const ViewCustomerModal = ({ closeViewModal, activeUser }) => {
  const { locations } = useSelector((state) => state.location); // Assume location slice for fetching locations

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
        <div className="viewcustomer-left-right">
          {/* Name */}
          <Typography variant="h6" className="viewcustomer-info-label">
            Name:
          </Typography>
          <Typography variant="h6" className="viewcustomer-info-value">
            {activeUser.profile?.firstName + " " + activeUser.profile?.lastName}
          </Typography>
        </div>

        <div className="viewcustomer-left-right">
          {/* Email */}
          <Typography variant="body2" className="viewcustomer-info-label">
            Email:
          </Typography>
          <Typography variant="body2" className="viewcustomer-info-value">
            {activeUser.user?.email}
          </Typography>
        </div>

        <div className="viewcustomer-left-right">
          {/* Phone Number */}
          <Typography variant="body2" className="viewcustomer-info-label">
            Phone Number:
          </Typography>
          <Typography variant="body2" className="viewcustomer-info-value">
            {activeUser.profile?.phone_number}
          </Typography>
        </div>

        <div className="viewcustomer-left-right">
          {/* Role */}
          <Typography variant="body2" className="viewcustomer-info-label">
            Role:
          </Typography>
          <Typography variant="body2" className="viewcustomer-info-value">
            {activeUser.user?.role}
          </Typography>
        </div>

        <div className="viewcustomer-left-right">
          {/* Address */}
          <Typography variant="body2" className="viewcustomer-info-label">
            Address:
          </Typography>
          <Typography variant="body2" className="viewcustomer-info-value">
            {activeUser.profile?.address}
          </Typography>
        </div>

        <div className="viewcustomer-left-right">
          {/* Post Code */}
          <Typography variant="body2" className="viewcustomer-info-label">
            Post Code:
          </Typography>
          <Typography variant="body2" className="viewcustomer-info-value">
            {activeUser.profile?.post_code}
          </Typography>
        </div>

        <div className="viewcustomer-left-right">
          {/* Gender */}
          <Typography variant="body2" className="viewcustomer-info-label">
            Gender:
          </Typography>
          <Typography variant="body2" className="viewcustomer-info-value">
            {activeUser.profile?.gender}
          </Typography>
        </div>

        {/* Buttons for Minutes Balance and Total Spent */}
        <div className="viewcustomer-buttons">
          <Button variant="contained" className="viewcustomer-button">
            Minutes Balance: {activeUser.profile?.available_balance || 0}
          </Button>

          <Button variant="contained" className="viewcustomer-button">
            Total Spent: £{activeUser.profile?.total_spend?.toFixed(2) || 0}
          </Button>
        </div>
      </Box>
    </Card>
  );
};

export default ViewCustomerModal;
