import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login, signUp } from '../service/operations/authApi';
import  saloonLogo  from  '../logo/saloonLogo.jpg';

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleForm = (e) => {
        e.preventDefault();
        setIsSignUp(!isSignUp);
        setFormData({ email: '', password: '', confirmPassword: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            if (formData.password.length < 6) {
                toast.error('Password must be at least 6 characters long.');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords don't match.");
                return;
            }

            dispatch(signUp(formData, navigate));
            toast.success('Registered successfully!');
        } else {
            if (!formData.email || !formData.password) {
                toast.error('Please provide email and password.');
                return;
            }

            dispatch(login(formData.email, formData.password, navigate));
            toast.success('Logged in successfully!');
        }

        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="content-wrapper">
                <div className="form-container">
                    <h2 className="form-title">{isSignUp ? 'Sign up' : 'Sign in'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {isSignUp && (
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                className="input-field"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        )}
                        <button type="submit" className="auth-button">
                            {isSignUp ? 'Sign up' : 'Sign in'}
                        </button>
                    </form>
                    <p className="toggle-text">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <a href="#" onClick={toggleForm}>
                                    Sign in
                                </a>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <a href="#" onClick={toggleForm}>
                                    Sign up
                                </a>
                            </>
                        )}
                    </p>
                </div>

                {/* Image Container */}
                <div className="image-container">
                    <img
                        src={saloonLogo} // Replace with your image path
                        alt="Tanning Salon"
                        className="tanning-salon-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
