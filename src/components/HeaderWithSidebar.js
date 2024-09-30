/** @format */

import React, { useState } from 'react';
import './HeaderWithSidebar.css'; // CSS for Header and Sidebar
import { NavLink } from 'react-router-dom';

const HeaderWithSidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className='header-container'>
			<div className='header'>
				<div className='logo-section'>
					<img
						src='../assets/img/new_logo.png'
						alt='Tanning Salon Logo'
						className='logo'
					/>
					<span className='logo-text'>Tanning Salon</span>
				</div>
				<div
					className='hamburger-icon'
					onClick={toggleSidebar}
				>
					<i className='fa fa-bars'></i>
				</div>
			</div>

			{/* Sidebar */}
			<div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
				<div className='sidebar-header'>
					<h3>Menu</h3>
					<button
						className='close-button'
						onClick={toggleSidebar}
					>
						<i className='fa fa-times'></i>
					</button>
				</div>
				<ul className='sidebar-menu'>
					<li>
						<NavLink to='/locationStep'>Dashboard</NavLink>
					</li>
					<li>
						<NavLink to='/location'>Location</NavLink>
					</li>
					<li>
						<NavLink to='/users'>Users</NavLink>
					</li>
					<li>
						<NavLink to='/products'>Products</NavLink>
					</li>
					<li>
						<NavLink to='/services'>Services</NavLink>
					</li>
					<li>
						<NavLink to='/customers'>Customers</NavLink>
					</li>
					<li>
						<NavLink to='/transactions'>Transactions</NavLink>
					</li>
				</ul>
			</div>

			{/* Overlay */}
			{isSidebarOpen && (
				<div
					className='overlay'
					onClick={toggleSidebar}
				></div>
			)}
		</div>
	);
};

export default HeaderWithSidebar;
