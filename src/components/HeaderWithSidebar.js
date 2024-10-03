/** @format */

import React, { useState, useEffect } from 'react';
import './HeaderWithSidebar.css'; // Import the updated CSS
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../service/operations/authApi';

const HeaderWithSidebar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation(); // Use location to get the current URL path
	const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
	const [isCustomersReportSubmenuOpen, setIsCustomersReportSubmenuOpen] = useState(false);
	const [isTransactionsSubmenuOpen, setIsTransactionsSubmenuOpen] = useState(false);
	const { user: loginUser } = useSelector((state) => state.auth);

	// Close the sidebar on page navigation
	useEffect(() => {
		setIsSidebarOpen(false);
	}, [location]);

	// Handle submenu state based on current URL
	useEffect(() => {
		// Check if the current path is related to customers report submenu
		if (
			location.pathname.includes('/allcustomers') ||
			location.pathname.includes('/bydata') ||
			location.pathname.includes('/currentmonth') ||
			location.pathname.includes('/topcustomers')
		) {
			setIsCustomersReportSubmenuOpen(true);
		}

		// Check if the current path is related to transactions submenu
		if (
			location.pathname.includes('/productreport') ||
			location.pathname.includes('/serviceused') ||
			location.pathname.includes('/purchasereport')
		) {
			setIsTransactionsSubmenuOpen(true);
		} else {
			setIsTransactionsSubmenuOpen(false); // Close submenu if not on a transactions route
		}
	}, [location]);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
	};

	const toggleCustomersReportSubmenu = () => {
		setIsCustomersReportSubmenuOpen(!isCustomersReportSubmenuOpen);
	};

	const toggleTransactionsSubmenu = () => {
		setIsTransactionsSubmenuOpen(!isTransactionsSubmenuOpen);
	};

	const handleLogout = () => {
		dispatch(logout(navigate));
	};

	return (
		<div>
			{/* Hamburger Button (Only in tablet/mobile view) */}
			<div className='hamburger' onClick={toggleSidebar}>
				<i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
			</div>

			{/* Sidebar */}
			<div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
				{/* Sidebar Header */}
				<div className='sidebar-header'>
					<h3>Tanning Salon</h3>
					{isSidebarOpen && (
						<i className='fa fa-times' onClick={toggleSidebar}></i>
					)}
				</div>

				{/* Sidebar Menu */}
				<ul className='sidebar-menu'>
					<li>
						<NavLink to='/about' activeClassName='active'>
							Dashboard
						</NavLink>
					</li>
					{loginUser?.role === 'admin' && (
						<li>
							<NavLink to='/location' activeClassName='active'>
								Location
							</NavLink>
						</li>
					)}
					{loginUser?.role === 'admin' && (
						<li>
							<NavLink to='/users' activeClassName='active'>
								Users
							</NavLink>
						</li>
					)}
					<li>
						<NavLink to='/customers' activeClassName='active'>
							Customers
						</NavLink>
					</li>
					<li>
						<NavLink to='/products' activeClassName='active'>
							Products
						</NavLink>
					</li>
					{loginUser?.role === 'admin' && (
						<li>
							<NavLink to='/services' activeClassName='active'>
								Services
							</NavLink>
						</li>
					)}

					{loginUser?.role === 'admin' && (
						<li>
							{/* Customers Report with Submenu */}
							<div className='submenu-item'>
								<span
									className='submenu-title'
									onClick={toggleCustomersReportSubmenu}
								>
									Customers Report
									<i
										className={`fa ${
											isCustomersReportSubmenuOpen
												? 'fa-chevron-up'
												: 'fa-chevron-down'
										}`}></i>
								</span>
								{isCustomersReportSubmenuOpen && (
									<ul className='submenu'>
										<li>
											<NavLink to='/allcustomers' activeClassName='active'>
												All Customers
											</NavLink>
										</li>
										<li>
											<NavLink to='/bydata' activeClassName='active'>
												By Date
											</NavLink>
										</li>
										<li>
											<NavLink to='/currentmonth' activeClassName='active'>
												Current Month
											</NavLink>
										</li>
										<li>
											<NavLink to='/topcustomers' activeClassName='active'>
												Top Customers
											</NavLink>
										</li>
									</ul>
								)}
							</div>
						</li>
					)}

					{loginUser?.role === 'admin' && (
						<li>
							{/* Transactions with Submenu */}
							<div className='submenu-item'>
								<span className='submenu-title' onClick={toggleTransactionsSubmenu}>
									Transaction
									<i
										className={`fa ${
											isTransactionsSubmenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'
										}`}></i>
								</span>
								{isTransactionsSubmenuOpen && (
									<ul className='submenu'>
										<li>
											<NavLink to='/productreport' activeClassName='active'>
												Products
											</NavLink>
										</li>
										<li>
											<NavLink to='/serviceused' activeClassName='active'>
												Services
											</NavLink>
										</li>
										<li>
											<NavLink to='/purchasereport' activeClassName='active'>
												Usage
											</NavLink>
										</li>
									</ul>
								)}
							</div>
						</li>
					)}
				</ul>

				{/* Logout Button */}
				<div className='logout-button' onClick={handleLogout}>
					<i className='fa fa-sign-out-alt'></i>
					<span>Logout</span>
				</div>
			</div>
		</div>
	);
};

export default HeaderWithSidebar;
