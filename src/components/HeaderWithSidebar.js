/** @format */

import React, { useState, useEffect } from 'react';
import './HeaderWithSidebar.css'; // Import the updated CSS
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../service/operations/authApi';

/* Import FontAwesomeIcon and the relevant icons */
import { 
    FontAwesomeIcon 
} from '@fortawesome/react-fontawesome';
import { 
    faSpa, faChevronDown, faChevronUp, faSignOutAlt, faUser, faBox, faChartLine, faCog, faLocationArrow, faUsers, faFileAlt 
} from '@fortawesome/free-solid-svg-icons';

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
        if (
            location.pathname.includes('/allcustomers') ||
            location.pathname.includes('/productreport') ||
            location.pathname.includes('/serviceused') ||
            location.pathname.includes('/purchasereport')
        ) {
            setIsCustomersReportSubmenuOpen(true);
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
                    <h3>
                        {/* Use FontAwesome spa icon */}
                        <FontAwesomeIcon icon={faSpa} /> Tanning Salon
                    </h3>
                    {isSidebarOpen && (
                        <i className='fa fa-times' onClick={toggleSidebar}></i>
                    )}
                </div>

                {/* Sidebar Menu */}
                <ul className='sidebar-menu'>
                    <li>
                        <NavLink to='/about' activeClassName='active'>
                            <FontAwesomeIcon icon={faChartLine} /> Dashboard
                        </NavLink>
                    </li>
                    {loginUser?.role === 'admin' && (
                        <li>
                            <NavLink to='/location' activeClassName='active'>
                                <FontAwesomeIcon icon={faLocationArrow} /> Location
                            </NavLink>
                        </li>
                    )}
                    {loginUser?.role === 'admin' && (
                        <li>
                            <NavLink to='/users' activeClassName='active'>
                                <FontAwesomeIcon icon={faUsers} /> Users
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink to='/customers' activeClassName='active'>
                            <FontAwesomeIcon icon={faUser} /> Customers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/products' activeClassName='active'>
                            <FontAwesomeIcon icon={faBox} /> Products
                        </NavLink>
                    </li>
                    {loginUser?.role === 'admin' && (
                        <li>
                            <NavLink to='/services' activeClassName='active'>
                                <FontAwesomeIcon icon={faCog} /> Services
                            </NavLink>
                        </li>
                    )}

                    {loginUser?.role === 'admin' && (
                        <li>
                            {/* Report with Submenu */}
                            <div className='submenu-item'>
                                <span
                                    className='submenu-title'
                                    onClick={toggleCustomersReportSubmenu}
                                >
                                    <FontAwesomeIcon icon={faFileAlt} /> Report
                                    <FontAwesomeIcon
                                        icon={isCustomersReportSubmenuOpen ? faChevronUp : faChevronDown}
                                        className="submenu-icon"
                                    />
                                </span>
                                {isCustomersReportSubmenuOpen && (
                                    <ul className='submenu'>
                                        <li>
                                            <NavLink to='/allcustomers' activeClassName='active'>
                                                <FontAwesomeIcon icon={faUser} /> Customers
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='/productreport' activeClassName='active'>
                                                <FontAwesomeIcon icon={faBox} /> Products
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='/serviceused' activeClassName='active'>
                                                <FontAwesomeIcon icon={faCog} /> Services
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to='/purchasereport' activeClassName='active'>
                                                <FontAwesomeIcon icon={faChartLine} /> Usage
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
                    <FontAwesomeIcon className='logouticon' icon={faSignOutAlt} />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default HeaderWithSidebar;
