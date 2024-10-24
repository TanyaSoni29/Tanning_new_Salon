import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateService } from '../../service/operations/serviceAndServiceTransaction';
import { refreshService } from '../../slices/serviceSlice';

const EditServiceModal = ({ activeService, closeEditModal }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();

  const handleSubmitForm = async (data) => {
    try {
      const updatedData = {
        serviceName: data.serviceName,
        price: Number(data.price),
        minutesAvailable: data.minutesAvailable,
      };
      const result = await updateService(token, activeService.id, updatedData);

      if (result) {
        dispatch(refreshService());
        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating Service:', error);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        serviceName: '',
        price: '',
        minutesAvailable: '',
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <Box
      sx={{
        width: { xs: '90%', md: '400px' }, // Responsive width for mobile and desktop
        backgroundColor: 'var(--modal--formbg)',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        margin: '0 auto',
        marginTop: { xs: '20px', md: '100px' }, // Adjust margin for mobile and desktop
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h6"
        color='var(--modal--formbgtextcol)'
        sx={{ marginBottom: '16px', textAlign: 'center' }}
      >
        Edit Service
      </Typography>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box mt={2}>
          <TextField
            label="Name"
            fullWidth
            defaultValue={activeService?.serviceName}
            {...register('serviceName', { required: true })}
            InputLabelProps={{
              style: { color: 'var(--modal--formbgtextcol)' }, // Label color
            }}
            InputProps={{
              style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
            }}
          />
          <Box
            mt={2}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
              gap: '16px',
            }}
          >
            <TextField
              label="Price"
              fullWidth
              defaultValue={activeService?.price}
              type="number"
              {...register('price', { required: true })}
              InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
            />
            <TextField
              label="Minutes"
              fullWidth
              defaultValue={activeService?.minutesAvailable}
              type="number"
              {...register('minutesAvailable', { required: true })}
              InputLabelProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Label color
							}}
							InputProps={{
								style: { color: 'var(--modal--formbgtextcol)' }, // Input text color
							}}
            />
          </Box>
        </Box>

        <Box
          mt={2}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            flexDirection: { xs: 'column', md: 'row' }, // Stack buttons vertically on mobile
          }}
        >
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: '#0c65be',
              color: '#fff',
              width: { xs: '100%', md: 'auto' }, // Full width on mobile, auto on desktop
              textTransform: 'none',
              ':hover': {
                backgroundColor: '#004080',
              },
            }}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            onClick={closeEditModal}
            sx={{
              width: { xs: '100%', md: 'auto' }, // Full width on mobile, auto on desktop
              textTransform: 'none',
              borderColor: '#ccc',
              color: 'white',
              ':hover': {
                backgroundColor: '#f1f1f1',
              },
            }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditServiceModal;
