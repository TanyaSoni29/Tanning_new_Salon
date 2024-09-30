/** @format */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element }) => {
	const { isAuth, loading } = useSelector((state) => state.auth);

	if (loading) {
		// Show a loading screen while authentication is being checked
		return <div>Loading...</div>;
	}

	if (!isAuth) {
		// If user is not authenticated, redirect to login
		return (
			<Navigate
				to='/'
				replace
			/>
		);
	}

	// If the user is authenticated, render the component
	return element;
};

export default ProtectedRoute;
