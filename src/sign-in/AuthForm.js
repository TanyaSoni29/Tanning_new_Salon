/** @format */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './AuthForm.css'; // Import the CSS file for styles
import backgroundImage from '../images/wizard.jpg'; // Make sure to import your background image
import tanningSalonImage from '../images/bg-login.png'; // Import the salon illustration image
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../service/operations/authApi';
const AuthForm = () => {
	const [isSignUp, setIsSignUp] = useState(false); // State to toggle between SignIn and SignUp forms
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const dispatch = useDispatch();
	const navigate = useNavigate(); // Initialize the useNavigate hook

	// Toggle form view
	const toggleForm = () => {
		setIsSignUp(!isSignUp);
		setFormData({ name: '', email: '', password: '', confirmPassword: '' }); // Clear form data
	};

	// Handle form data changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		// For simplicity, let's assume the form is validated and authenticated.
		// You can add validation or authentication logic here.

		if (isSignUp) {
			// Additional logic for Sign Up
			console.log('Sign Up data:', formData);
		} else {
			if (formData.email && formData.password) {
				dispatch(login(formData.email, formData.password, navigate));
			} else {
				toast.error('Please provide email and password.');
			}
			console.log('Sign In data:', formData);
		}

		// Redirect to /locationStep after form submission
		navigate('/locationStep');
	};

	return (
		<div
			className='auth-container'
			// style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className='content-wrapper'>
				<div className='form-container'>
					<h2 className='form-title'>{isSignUp ? 'Sign up' : 'Sign in'}</h2>

					<form onSubmit={handleSubmit}>
						{isSignUp && (
							<>
								<input
									type='text'
									name='name'
									placeholder='Enter your name'
									className='input-field'
									value={formData.name}
									onChange={handleChange}
									required
								/>
							</>
						)}
						<input
							type='email'
							name='email'
							placeholder='Enter your email'
							className='input-field'
							value={formData.email}
							onChange={handleChange}
							required
						/>
						<input
							type='password'
							name='password'
							placeholder='Enter your password'
							className='input-field'
							value={formData.password}
							onChange={handleChange}
							required
						/>
						{isSignUp && (
							<>
								<input
									type='password'
									name='confirmPassword'
									placeholder='Confirm your password'
									className='input-field'
									value={formData.confirmPassword}
									onChange={handleChange}
									required
								/>
							</>
						)}
						<button
							type='submit'
							className='auth-button'
						>
							{isSignUp ? 'Sign up' : 'Sign in'}
						</button>
					</form>

					<p className='toggle-text'>
						{isSignUp ? (
							<>
								Already have an account?{' '}
								<a
									href='#'
									onClick={toggleForm}
								>
									Sign in
								</a>
							</>
						) : (
							<>
								Don’t have an account?{' '}
								<a
									href='#'
									onClick={toggleForm}
								>
									Sign up
								</a>
							</>
						)}
					</p>
				</div>

				{/* <div className='image-container'>
					<img
						// src={tanningSalonImage}
						alt='Tanning Salon'
						className='tanning-salon-image'
					/>
				</div> */}
			</div>
		</div>
	);
};

export default AuthForm;
