// EditUserModal.js
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "../../service/operations/userProfileApi";
import { refreshUser } from "../../slices/userProfileSlice";
import { refreshLocation } from "../../slices/locationSlice";

const EditUserModal = ({ activeUser, closeEditModal }) => {
  const { locations, loading } = useSelector((state) => state.location);
  const [preferredLocation, setPreferredLocation] = useState("");
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (!activeUser) {
      closeEditModal();
    }
  }, []);

  useEffect(() => {
    dispatch(refreshLocation());
  }, [dispatch]);

  useEffect(() => {
    if (activeUser?.profile?.preferred_location && locations.length > 0) {
      setPreferredLocation(activeUser.profile.preferred_location);
    }
  }, [activeUser, locations]);

  const handleSubmitForm = async (data) => {
    try {
      const newUserData = {
        user_id: activeUser.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        email: data.email,
        address: data.address,
        post_code: data.post_code,
        phone_number: data.phone_number,
        gender: data.gender || "",
        gdpr_sms_active: data.gdpr_sms_active || false,
        gdpr_email_active: data.gdpr_email_active || false,
        referred_by: data.referred_by || "",
        preferred_location: data.preferred_location,
      };
      const updatedUser = await updateUserProfile(
        token,
        activeUser.user.id,
        newUserData
      );
      if (updatedUser) {
        dispatch({
          type: "userProfile/updateUser",
          payload: updatedUser,
        });
      }
      dispatch(refreshUser());
      closeEditModal();
    } catch (error) {
      console.error(error);
      closeEditModal();
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        address: "",
        postCode: "",
        phone_number: "",
        gender: "",
        referred_by: "",
        preferred_location: "",
        avatar: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  if (!activeUser) return null;

  return (
    <Box className="modal-container">
      <Typography id="edit-location-modal-title" variant="h6">
        Edit User
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box mt={2}>
          <Box className="form-row">
            <TextField
              label="First Name"
              variant="outlined"
              defaultValue={activeUser.profile?.firstName}
              {...register("firstName", { required: true })}
              fullWidth
            />
            <TextField
              label="Last Name"
              variant="outlined"
              defaultValue={activeUser.profile?.lastName}
              {...register("lastName", { required: true })}
              fullWidth
            />
          </Box>

          <Box className="form-row">
            <TextField
              label="Email"
              variant="outlined"
              defaultValue={activeUser.user?.email}
              {...register("email", { required: true })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              defaultValue={activeUser.profile?.phone_number}
              {...register("phone_number", { required: true })}
              fullWidth
            />
          </Box>

          <Box mb={2}>
            <TextField
              label="Address"
              variant="outlined"
              defaultValue={activeUser.profile?.address}
              {...register("address", { required: true })}
              fullWidth
            />
          </Box>

          <Box className="form-row">
            <TextField
              label="Post Code"
              variant="outlined"
              defaultValue={activeUser.profile?.post_code}
              {...register("post_code", { required: true })}
              fullWidth
            />

            <TextField
              label="Referred By"
              variant="outlined"
              defaultValue={activeUser.profile?.referred_by}
              {...register("referred_by")}
              fullWidth
            />
          </Box>

          <Box className="form-row">
            <select
              id="role"
              className="custom-select"
              defaultValue={activeUser.user?.role}
              {...register("role", { required: true })}
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="operator">User</option>
            </select>

            <select
              id="gender"
              className="custom-select"
              defaultValue={activeUser.profile?.gender}
              {...register("gender")}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Box>

          <Box className="form-row full-width">
            <select
              id="location"
              className="custom-select"
              value={preferredLocation}
              {...register("preferred_location", { required: true })}
              onChange={(e) => setPreferredLocation(e.target.value)}
              disabled={loading}
            >
              <option value="">Select location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </Box>
        </Box>

        <Box className="button-row">
          <Button variant="contained" className="confirm-button" type="submit">
            Submit
          </Button>
          <Button
            variant="contained"
            className="cancel-button"
            onClick={closeEditModal}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditUserModal;
