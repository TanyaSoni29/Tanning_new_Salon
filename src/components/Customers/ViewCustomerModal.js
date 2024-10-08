import React from "react";
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
    <Card
      sx={{
        width: { xs: "90%", md: "600px" },
        backgroundColor: "#fff",
        borderRadius: "10px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        padding: "24px",
        margin: "0 auto",
        marginTop: { xs: "60px", md: "100px" },
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
      }}
    >
      {/* Close Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          borderRadius: "50%",
          padding: "5px",
        }}
        onClick={closeViewModal}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: { xs: "12px", md: "0" },
              width: "100%",
            }}
          >
            {/* Left Side Information */}
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}
                >
                  Name:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, fontSize: "16px", color: "#555" }}
                >
                  {activeUser.profile?.firstName +
                    " " +
                    activeUser.profile?.lastName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}
                >
                  Address:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, fontSize: "16px", color: "#555" }}
                >
                  {activeUser.profile?.address}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}
                >
                  Phone Number:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, fontSize: "16px", color: "#555" }}
                >
                  {activeUser.profile?.phone_number}
                </Typography>
              </Box>
            </Box>

            {/* Right Side Information */}
            <Box sx={{ width: { xs: "100%", md: "48%" } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}
                >
                  Role:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, fontSize: "16px", color: "#555" }}
                >
                  {activeUser.user?.role}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}
                >
                  Email:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, fontSize: "16px", color: "#555" }}
                >
                  {activeUser.user?.email}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}
                >
                  Post Code:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, fontSize: "16px", color: "#555" }}
                >
                  {activeUser.profile?.post_code}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}
                >
                  Gender:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, fontSize: "16px", color: "#555" }}
                >
                  {activeUser.profile?.gender}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Buttons for Minutes Balance and Total Spent */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "20px",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: "10px", md: "0" },
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#045f09",
              color: "#fff",
              fontWeight: 600,
              padding: "10px 18px",
              borderRadius: "8px",
              width: { xs: "100%", md: "auto" },
              textTransform: "none",
              ":hover": {
                opacity: 0.9,
              },
            }}
          >
            Minutes Balance: {activeUser.profile?.available_balance || 0}
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0c65be",
              color: "#fff",
              fontWeight: 600,
              padding: "10px 18px",
              borderRadius: "8px",
              width: { xs: "100%", md: "auto" },
              textTransform: "none",
              ":hover": {
                opacity: 0.9,
              },
            }}
          >
            Total Spent: £{activeUser.profile?.total_spend?.toFixed(2) || 0}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ViewCustomerModal;
