/** @format */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './AuthForm.css'; // Import the CSS file for styles
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../service/operations/authApi';

const AuthForm = () => {
	const [isSignUp, setIsSignUp] = useState(false); // State to toggle between SignIn and SignUp forms
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const dispatch = useDispatch();
	const navigate = useNavigate(); // Initialize the useNavigate hook

	// Toggle form view
	const toggleForm = (e) => {
		e.preventDefault(); // Prevent default link behavior
		setIsSignUp(!isSignUp);
		setFormData({ email: '', password: '', confirmPassword: '' }); // Clear form data
	};

	// Handle form data changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent form submission
		// Validation for Sign-Up form
		if (isSignUp) {
			// Check if password has a minimum length of 6 characters
			if (formData.password.length < 6) {
				toast.error('Password must be at least 6 characters long.');
				console.log('Password too short');
				return; // Prevent form submission if password length is invalid
			}

			// Check if password and confirmPassword match
			if (formData.password !== formData.confirmPassword) {
				toast.error("Passwords don't match.");
				console.log('Passwords do not match');
				return; // Prevent form submission if passwords don't match
			}

			// Sign-Up logic goes here
			console.log('Sign Up data:', formData);
			toast.success('Signed up successfully!');
		} else {
			// Validation for Sign-In form
			if (!formData.email || !formData.password) {
				toast.error('Please provide email and password.');
				console.log('Missing email or password');
				return; // Prevent form submission if email or password is missing
			}

			// Sign-In logic goes here
			dispatch(login(formData.email, formData.password, navigate));
			toast.success('Logged in successfully!');
			console.log('Sign In data:', formData);
		}

		// Redirect to / after successful form submission
		navigate('/');
	};

	return (
		<div className='auth-container'>
			<div className='content-wrapper'>
				<div className='form-container'>
					<h2 className='form-title'>{isSignUp ? 'Sign up' : 'Sign in'}</h2>

					<form onSubmit={handleSubmit}>
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
							<input
								type='password'
								name='confirmPassword'
								placeholder='Confirm your password'
								className='input-field'
								value={formData.confirmPassword}
								onChange={handleChange}
								required
							/>
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
			</div>
		</div>
	);
};

export default AuthForm;
