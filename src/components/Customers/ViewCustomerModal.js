/** @format */

import React from "react";
import "./ViewCustomerModal.css"; // Importing CSS
import { Card, CardMedia, IconButton, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { formatDate } from "../../utils/formateDate"; // Assuming you have a utility for formatting the date

const ViewCustomerModal = ({ closeViewModal, activeUser }) => {
  const { locations } = useSelector((state) => state.location); // Assume location slice for fetching locations

  // Find preferred location
  const preferredLocation = locations.find(
    (location) => location.id === activeUser.profile?.preferred_location
  );

  return (
    <Card className="modal-card">
      {/* Close Button */}
      <IconButton className="close-button" onClick={closeViewModal}>
        <CloseIcon />
      </IconButton>

      <Box className="user-details">
        {/* Name */}
        <Typography variant="h6">
          {activeUser.profile?.firstName + " " + activeUser.profile?.lastName}
        </Typography>

        {/* Email */}
        <Typography variant="body2" className="text-secondary">
          {activeUser.user?.email}
        </Typography>

        {/* Phone Number */}
        <Typography variant="body2" className="text-secondary">
          {activeUser.profile?.phone_number}
        </Typography>

        {/* Role */}
        <Typography variant="body2" className="text-secondary">
          {activeUser.user?.role}
        </Typography>

        {/* Profile Image */}
        <CardMedia
          component="img"
          className="user-image"
          image={
            activeUser.avatar ||
            "https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
          }
          alt={
            activeUser.profile?.firstName + " " + activeUser.profile?.lastName
          }
        />

        {/* Address */}
        <Typography variant="body2" className="text-secondary">
          {activeUser.profile?.address}
        </Typography>

        {/* Post Code */}
        <Typography variant="body2" className="text-secondary">
          {activeUser.profile?.post_code}
        </Typography>

        {/* Gender */}
        <Typography variant="body2" className="text-secondary">
          {activeUser.profile?.gender}
        </Typography>

        {/* Preferred Location */}
        <Typography variant="h6" className="preferred-location">
          Preferred Location: {preferredLocation?.name}
        </Typography>

        {/* Created On */}
        <Typography variant="body2" className="text-secondary">
          Created On: {formatDate(activeUser.user.created_at)}
        </Typography>
      </Box>
    </Card>
  );
};

export default ViewCustomerModal;
