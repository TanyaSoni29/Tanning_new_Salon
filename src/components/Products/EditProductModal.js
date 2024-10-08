import React, { useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '../../service/operations/productAndProductTransaction';
import { refreshProduct } from '../../slices/productSlice';

const EditProductModal = ({ activeProduct, closeEditModal }) => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      name: activeProduct.name,
      price: activeProduct.price,
    },
  });

  const handleSubmitForm = async (data) => {
    try {
      const updatedData = {
        name: data.name,
        price: Number(data.price),
      };
      const result = await updateProduct(token, activeProduct.id, updatedData);

      if (result) {
        dispatch(refreshProduct());
        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: '',
        price: '',
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <Box
      sx={{
        width: { xs: '90%', md: '400px' }, // Responsive width
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        margin: '0 auto',
        marginTop: { xs: '20px', md: '100px' }, // Different margin for mobile and desktop
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: '16px', textAlign: 'center' }}
      >
        Edit Product
      </Typography>

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <TextField
            label="Name"
            fullWidth
            {...register('name', { required: true })}
          />
          <TextField
            label="Price"
            fullWidth
            type="number"
            {...register('price', { required: true })}
          />
        </Box>

        <Box
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
              color: '#666',
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

export default EditProductModal;
