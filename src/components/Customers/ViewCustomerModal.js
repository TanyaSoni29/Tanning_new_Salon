import React from "react";
import "./ViewCustomerModal.css"; // Importing CSS
import { Card, IconButton, Typography, Box } from "@mui/material";
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
        {/* Name and Minutes Balance */}
        <div className="viewcustomer-user-info">
          <Typography variant="h6" className="viewcustomer-info-label">
            Name:{" "}
            <Typography variant="h6" component="span" className="viewcustomer-info-value">
              {activeUser.profile?.firstName + " " + activeUser.profile?.lastName}
            </Typography>
          </Typography>

          <Typography variant="h6" className="viewcustomer-info-label">
            Minutes Balance:{" "}
            <Typography variant="h6" component="span" className="viewcustomer-info-value">
              {activeUser.profile?.available_balance || 0}
            </Typography>
          </Typography>
        </div>

        {/* Phone Number and Total Spent */}
        <div className="viewcustomer-user-info">
          <Typography variant="body2" className="viewcustomer-info-label">
            Phone Number:{" "}
            <Typography variant="body2" component="span" className="viewcustomer-info-value">
              {activeUser.profile?.phone_number}
            </Typography>
          </Typography>

          <Typography variant="body2" className="viewcustomer-info-label">
            Total Spent:{" "}
            <Typography variant="body2" component="span" className="viewcustomer-info-value">
              £{activeUser.profile?.total_spend?.toFixed(2) || 0}
            </Typography>
          </Typography>
        </div>

        {/* Gender */}
        <Typography variant="body2" className="viewcustomer-info-label">
          Gender:{" "}
          <Typography variant="body2" component="span" className="viewcustomer-info-value">
            {activeUser.profile?.gender}
          </Typography>
        </Typography>
      </Box>
    </Card>
  );
};

export default ViewCustomerModal;
