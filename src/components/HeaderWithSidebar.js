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
	const [isReportSubmenuOpen, setIsReportSubmenuOpen] = useState(false);
	const [isCustomersSubmenuOpen, setIsCustomersSubmenuOpen] = useState(false);
	const [isTransactionsSubmenuOpen, setIsTransactionsSubmenuOpen] =
		useState(false);
	const [isSalesSubmenuOpen, setIsSalesSubmenuOpen] = useState(false);
	const { user: loginUser } = useSelector((state) => state.auth);

	// Close the sidebar on page navigation
	useEffect(() => {
		setIsSidebarOpen(false);
	}, [location]);

	// Handle submenu state based on current URL
	useEffect(() => {
		// Check if the current path is related to customers submenu
		if (
			location.pathname.includes('/allcustomers') ||
			location.pathname.includes('/bydata') ||
			location.pathname.includes('/currentmonth') ||
			location.pathname.includes('/topcustomers')
		) {
			setIsReportSubmenuOpen(true);
			setIsCustomersSubmenuOpen(true);
		}

		// Check if the current path is related to transactions submenu
		if (
			location.pathname.includes('/serviceused') ||
			location.pathname.includes('/purchasereport') ||
			location.pathname.includes('/productreport')
		) {
			setIsReportSubmenuOpen(true);
			setIsTransactionsSubmenuOpen(true);
		}

		// Check if the current path is related to sales submenu
		if (
			location.pathname.includes('/purchasereport') ||
			location.pathname.includes('/productreport')
		) {
			setIsReportSubmenuOpen(true);
			setIsTransactionsSubmenuOpen(true);
			setIsSalesSubmenuOpen(true);
		}
	}, [location]);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
	};

	const toggleReportSubmenu = () => {
		setIsReportSubmenuOpen(!isReportSubmenuOpen);
	};

	const toggleCustomersSubmenu = () => {
		setIsCustomersSubmenuOpen(!isCustomersSubmenuOpen);
	};

	const toggleTransactionsSubmenu = () => {
		setIsTransactionsSubmenuOpen(!isTransactionsSubmenuOpen);
	};

	const toggleSalesSubmenu = () => {
		setIsSalesSubmenuOpen(!isSalesSubmenuOpen);
	};

	const handleLogout = () => {
		dispatch(logout(navigate));
	};

	return (
		<div>
			{/* Hamburger Button (Only in tablet/mobile view) */}
			<div
				className='hamburger'
				onClick={toggleSidebar}
			>
				<i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
			</div>

			{/* Sidebar */}
			<div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
				{/* Sidebar Header */}
				<div className='sidebar-header'>
					<h3>Menu</h3>
					{isSidebarOpen && (
						<i
							className='fa fa-times'
							onClick={toggleSidebar}
						></i>
					)}
				</div>

				{/* Sidebar Menu */}
				<ul className='sidebar-menu'>
					<li>
						<NavLink
							to='/about'
							activeClassName='active'
						>
							Dashboard
						</NavLink>
					</li>
					{loginUser?.role === 'admin' && (
						<li>
							<NavLink
								to='/location'
								activeClassName='active'
							>
								Location
							</NavLink>
						</li>
					)}
					{loginUser?.role === 'admin' && (
						<li>
							<NavLink
								to='/users'
								activeClassName='active'
							>
								Users
							</NavLink>
						</li>
					)}
					<li>
						<NavLink
							to='/products'
							activeClassName='active'
						>
							Products
						</NavLink>
					</li>
					{loginUser?.role === 'admin' && (
						<li>
							<NavLink
								to='/services'
								activeClassName='active'
							>
								Services
							</NavLink>
						</li>
					)}
					<li>
						<NavLink
							to='/customers'
							activeClassName='active'
						>
							Customers
						</NavLink>
					</li>
					{loginUser?.role === 'admin' && (
						<li>
							{/* Report with Submenu */}
							<div className='submenu-item'>
								<span
									className='submenu-title'
									onClick={toggleReportSubmenu}
								>
									Report
									<i
										className={`fa ${
											isReportSubmenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'
										}`}
									></i>
								</span>
								{isReportSubmenuOpen && (
									<ul className='submenu'>
										<li className='submenu-item'>
											<span
												className='submenu-title'
												onClick={toggleCustomersSubmenu}
											>
												Customers
												<i
													className={`fa ${
														isCustomersSubmenuOpen
															? 'fa-chevron-up'
															: 'fa-chevron-down'
													}`}
												></i>
											</span>
											{isCustomersSubmenuOpen && (
												<ul className='submenu'>
													<li>
														<NavLink
															to='/allcustomers'
															activeClassName='active'
														>
															All Customers
														</NavLink>
													</li>
													{/* <li>
														<NavLink
															to='/bydata'
															activeClassName='active'
														>
															By Date
														</NavLink>
													</li>
													<li>
														<NavLink
															to='/currentmonth'
															activeClassName='active'
														>
															Current Month
														</NavLink>
													</li>
													<li>
														<NavLink
															to='/topcustomers'
															activeClassName='active'
														>
															Top Customers
														</NavLink>
													</li> */}
												</ul>
											)}
										</li>
										<li className='submenu-item'>
											<span
												className='submenu-title'
												onClick={toggleTransactionsSubmenu}
											>
												Transactions
												<i
													className={`fa ${
														isTransactionsSubmenuOpen
															? 'fa-chevron-up'
															: 'fa-chevron-down'
													}`}
												></i>
											</span>
											{isTransactionsSubmenuOpen && (
												<ul className='submenu'>
													<li>
														<NavLink
															to='/serviceused'
															activeClassName='active'
														>
															Services Used
														</NavLink>
													</li>
													<li className='submenu-item'>
														<span
															className='submenu-title'
															onClick={toggleSalesSubmenu}
														>
															Sales
															<i
																className={`fa ${
																	isSalesSubmenuOpen
																		? 'fa-chevron-up'
																		: 'fa-chevron-down'
																}`}
															></i>
														</span>
														{isSalesSubmenuOpen && (
															<ul className='submenu'>
																<li>
																	<NavLink
																		to='/purchasereport'
																		activeClassName='active'
																	>
																		Purchase
																	</NavLink>
																</li>
																<li>
																	<NavLink
																		to='/productreport'
																		activeClassName='active'
																	>
																		Product
																	</NavLink>
																</li>
															</ul>
														)}
													</li>
												</ul>
											)}
										</li>
									</ul>
								)}
							</div>
						</li>
					)}
					{/* {loginUser?.role === 'admin' && (
						<li>
							<NavLink to="/qrcode" activeClassName="active">
								QRCode
							</NavLink>
						</li>
					)} */}
				</ul>

				{/* Logout Button */}
				<div
					className='logout-button'
					onClick={handleLogout}
				>
					<i className='fa fa-sign-out-alt'></i>
					<span>Logout</span>
				</div>
			</div>
		</div>
	);
};

export default HeaderWithSidebar;
