// /** @format */

// import React, { useState } from 'react';
// import './HeaderWithSidebar.css'; // CSS for Header and Sidebar
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { logout } from '../service/operations/authApi';
// const HeaderWithSidebar = () => {
// 	const dispatch = useDispatch();
// 	const navigate = useNavigate();
// 	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// 	const [isReportSubmenuOpen, setIsReportSubmenuOpen] = useState(false);
// 	const [isCustomersSubmenuOpen, setIsCustomersSubmenuOpen] = useState(false);
// 	const [isTransactionsSubmenuOpen, setIsTransactionsSubmenuOpen] =
// 		useState(false);
// 	const [isSalesSubmenuOpen, setIsSalesSubmenuOpen] = useState(false); // State for sales submenu

// 	const toggleSidebar = () => {
// 		setIsSidebarOpen(!isSidebarOpen);
// 	};

// 	const toggleReportSubmenu = () => {
// 		setIsReportSubmenuOpen(!isReportSubmenuOpen);
// 	};

// 	const toggleCustomersSubmenu = () => {
// 		setIsCustomersSubmenuOpen(!isCustomersSubmenuOpen);
// 	};

// 	const toggleTransactionsSubmenu = () => {
// 		setIsTransactionsSubmenuOpen(!isTransactionsSubmenuOpen);
// 	};

// 	const toggleSalesSubmenu = () => {
// 		setIsSalesSubmenuOpen(!isSalesSubmenuOpen);
// 	};

// 	const handlelogOut = () => {
// 		dispatch(logout(navigate));
// 	};

// 	return (
// 		<div className='header-container'>
// 			<div className='header'>
// 				<div className='logo-section'>
// 					<img
// 						src='../assets/img/new_logo.png'
// 						alt='Tanning Salon Logo'
// 						className='logo'
// 					/>
// 					<span className='logo-text'>Tanning Salon</span>
// 				</div>
// 				<div
// 					className='hamburger-icon'
// 					onClick={toggleSidebar}
// 				>
// 					<i className='fa fa-bars'></i>
// 				</div>
// 			</div>

// 			{/* Sidebar */}
// 			<div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
// 				<div className='sidebar-header'>
// 					<h3>Menu</h3>
// 					<button
// 						className='navclose-button'
// 						onClick={toggleSidebar}
// 					>
// 						<i className='fa fa-times'></i>
// 					</button>
// 				</div>
// 				<ul className='sidebar-menu'>
// 					<li>
// 						<NavLink
// 							to='/locationStep'
// 							className={({ isActive }) => (isActive ? 'active' : '')}
// 						>
// 							Dashboard
// 						</NavLink>
// 					</li>
// 					<li>
// 						<NavLink
// 							to='/location'
// 							className={({ isActive }) => (isActive ? 'active' : '')}
// 						>
// 							Location
// 						</NavLink>
// 					</li>
// 					<li>
// 						<NavLink
// 							to='/users'
// 							className={({ isActive }) => (isActive ? 'active' : '')}
// 						>
// 							Users
// 						</NavLink>
// 					</li>
// 					<li>
// 						<NavLink
// 							to='/products'
// 							className={({ isActive }) => (isActive ? 'active' : '')}
// 						>
// 							Products
// 						</NavLink>
// 					</li>
// 					<li>
// 						<NavLink
// 							to='/services'
// 							className={({ isActive }) => (isActive ? 'active' : '')}
// 						>
// 							Services
// 						</NavLink>
// 					</li>
// 					<li>
// 						<NavLink
// 							to='/customers'
// 							className={({ isActive }) => (isActive ? 'active' : '')}
// 						>
// 							Customers
// 						</NavLink>
// 					</li>
// 					<li>
// 						{/* Report with Submenu */}
// 						<div className='submenu-item'>
// 							<span
// 								className='submenu-title'
// 								onClick={toggleReportSubmenu}
// 							>
// 								Report{' '}
// 								<i
// 									className={`fa ${
// 										isReportSubmenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'
// 									}`}
// 								></i>
// 							</span>
// 							{isReportSubmenuOpen && (
// 								<ul className='submenu'>
// 									{/* Customers Submenu */}
// 									<li className='submenu-item'>
// 										<span
// 											className='submenu-title'
// 											onClick={toggleCustomersSubmenu}
// 										>
// 											Customers{' '}
// 											<i
// 												className={`fa ${
// 													isCustomersSubmenuOpen
// 														? 'fa-chevron-up'
// 														: 'fa-chevron-down'
// 												}`}
// 											></i>
// 										</span>
// 										{isCustomersSubmenuOpen && (
// 											<ul className='submenu'>
// 												<li>
// 													<NavLink
// 														to='/allcustomers'
// 														className={({ isActive }) =>
// 															isActive ? 'active' : ''
// 														}
// 													>
// 														All Customers
// 													</NavLink>
// 												</li>
// 												<li>
// 													<NavLink
// 														to='/bydata'
// 														className={({ isActive }) =>
// 															isActive ? 'active' : ''
// 														}
// 													>
// 														By Date
// 													</NavLink>
// 												</li>
// 												<li>
// 													<NavLink
// 														to='/currentmonth'
// 														className={({ isActive }) =>
// 															isActive ? 'active' : ''
// 														}
// 													>
// 														Current Month
// 													</NavLink>
// 												</li>
// 												<li>
// 													<NavLink
// 														to='/topcustomers'
// 														className={({ isActive }) =>
// 															isActive ? 'active' : ''
// 														}
// 													>
// 														Top Customers
// 													</NavLink>
// 												</li>
// 											</ul>
// 										)}
// 									</li>
// 									{/* Transactions Submenu */}
// 									<li className='submenu-item'>
// 										<span
// 											className='submenu-title'
// 											onClick={toggleTransactionsSubmenu}
// 										>
// 											Transactions{' '}
// 											<i
// 												className={`fa ${
// 													isTransactionsSubmenuOpen
// 														? 'fa-chevron-up'
// 														: 'fa-chevron-down'
// 												}`}
// 											></i>
// 										</span>
// 										{isTransactionsSubmenuOpen && (
// 											<ul className='submenu'>
// 												<li>
// 													<NavLink
// 														to='/serviceused'
// 														className={({ isActive }) =>
// 															isActive ? 'active' : ''
// 														}
// 													>
// 														Services Used
// 													</NavLink>
// 												</li>
// 												{/* Sales with Submenu */}
// 												<li className='submenu-item'>
// 													<span
// 														className='submenu-title'
// 														onClick={toggleSalesSubmenu}
// 													>
// 														Sales{' '}
// 														<i
// 															className={`fa ${
// 																isSalesSubmenuOpen
// 																	? 'fa-chevron-up'
// 																	: 'fa-chevron-down'
// 															}`}
// 														></i>
// 													</span>
// 													{isSalesSubmenuOpen && (
// 														<ul className='submenu'>
// 															<li>
// 																<NavLink
// 																	to='/purchasereport'
// 																	className={({ isActive }) =>
// 																		isActive ? 'active' : ''
// 																	}
// 																>
// 																	Purchase
// 																</NavLink>
// 															</li>
// 															<li>
// 																<NavLink
// 																	to='/productreport'
// 																	className={({ isActive }) =>
// 																		isActive ? 'active' : ''
// 																	}
// 																>
// 																	Product
// 																</NavLink>
// 															</li>
// 														</ul>
// 													)}
// 												</li>
// 											</ul>
// 										)}
// 									</li>
// 								</ul>
// 							)}
// 						</div>
// 					</li>
// 					<li>
// 						<NavLink
// 							to='/qrcode'
// 							className={({ isActive }) => (isActive ? 'active' : '')}
// 						>
// 							QRCode
// 						</NavLink>
// 					</li>
// 				</ul>
// 				{/* Logout Button */}
// 				<div
// 					className='logout-button'
// 					onClick={handlelogOut}
// 				>
// 					<i className='fa fa-sign-out-alt'></i>
// 					<span>Logout</span>
// 				</div>
// 			</div>

// 			{/* Overlay */}
// 			{isSidebarOpen && (
// 				<div
// 					className='overlay'
// 					onClick={toggleSidebar}
// 				></div>
// 			)}
// 		</div>
// 	);
// };

// export default HeaderWithSidebar;


import React, { useState } from 'react';
import './HeaderWithSidebar.css'; // CSS for Header and Sidebar
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../service/operations/authApi';

const HeaderWithSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isReportSubmenuOpen, setIsReportSubmenuOpen] = useState(false);
  const [isCustomersSubmenuOpen, setIsCustomersSubmenuOpen] = useState(false);
  const [isTransactionsSubmenuOpen, setIsTransactionsSubmenuOpen] =
    useState(false);
  const [isSalesSubmenuOpen, setIsSalesSubmenuOpen] = useState(false); // State for sales submenu

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

  const handlelogOut = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className='sidebar open'> {/* Sidebar always open */}
      {/* Sidebar Header */}
      <div className='sidebar-header'>
        <h3>Menu</h3>
      </div>

      {/* Sidebar Menu */}
      <ul className='sidebar-menu'>
        <li>
          <NavLink
            to='/about'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/location'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Location
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/users'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/products'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/services'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Services
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/customers'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Customers
          </NavLink>
        </li>
        <li>
          {/* Report with Submenu */}
          <div className='submenu-item'>
            <span className='submenu-title' onClick={toggleReportSubmenu}>
              Report{' '}
              <i
                className={`fa ${
                  isReportSubmenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'
                }`}
              ></i>
            </span>
            {isReportSubmenuOpen && (
              <ul className='submenu'>
                {/* Customers Submenu */}
                <li className='submenu-item'>
                  <span
                    className='submenu-title'
                    onClick={toggleCustomersSubmenu}
                  >
                    Customers{' '}
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
                          className={({ isActive }) =>
                            isActive ? 'active' : ''
                          }
                        >
                          All Customers
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to='/bydata'
                          className={({ isActive }) =>
                            isActive ? 'active' : ''
                          }
                        >
                          By Date
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to='/currentmonth'
                          className={({ isActive }) =>
                            isActive ? 'active' : ''
                          }
                        >
                          Current Month
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to='/topcustomers'
                          className={({ isActive }) =>
                            isActive ? 'active' : ''
                          }
                        >
                          Top Customers
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
                {/* Transactions Submenu */}
                <li className='submenu-item'>
                  <span
                    className='submenu-title'
                    onClick={toggleTransactionsSubmenu}
                  >
                    Transactions{' '}
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
                          className={({ isActive }) =>
                            isActive ? 'active' : ''
                          }
                        >
                          Services Used
                        </NavLink>
                      </li>
                      {/* Sales with Submenu */}
                      <li className='submenu-item'>
                        <span
                          className='submenu-title'
                          onClick={toggleSalesSubmenu}
                        >
                          Sales{' '}
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
                                className={({ isActive }) =>
                                  isActive ? 'active' : ''
                                }
                              >
                                Purchase
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to='/productreport'
                                className={({ isActive }) =>
                                  isActive ? 'active' : ''
                                }
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
        <li>
          <NavLink
            to='/qrcode'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            QRCode
          </NavLink>
        </li>
      </ul>

      {/* Logout Button */}
      <div className='logout-button' onClick={handlelogOut}>
        <i className='fa fa-sign-out-alt'></i>
        <span>Logout</span>
      </div>
    </div>
  );
};

export default HeaderWithSidebar;
