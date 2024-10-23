import React, { useState, useEffect } from 'react';
import './HeaderWithSidebar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../service/operations/authApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronUp,
    faSignOutAlt,
    faUser,
    faBox,
    faChartLine,
    faCog,
    faLocationArrow,
    faUsers,
    faFileAlt,
} from '@fortawesome/free-solid-svg-icons';

import saloon1 from '../logo/saloonLogo (1).jpg';

const HeaderWithSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCustomersReportSubmenuOpen, setIsCustomersReportSubmenuOpen] = useState(false);
    const { user: loginUser } = useSelector((state) => state.auth);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    useEffect(() => {
        if (
            location.pathname.includes('/allcustomers') ||
            location.pathname.includes('/topcustomers') ||
            location.pathname.includes('/productreport') ||
            location.pathname.includes('/serviceused') ||
            location.pathname.includes('/purchasereport')
        ) {
            setIsCustomersReportSubmenuOpen(true);
        }
    }, [location]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleCustomersReportSubmenu = () => {
        setIsCustomersReportSubmenuOpen(!isCustomersReportSubmenuOpen);
    };

    const handleLogout = () => {
        dispatch(logout(navigate));
    };

    return (
        <div>
            <div className='hamburger' onClick={toggleSidebar}>
                <i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </div>

            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {/* Sidebar Header with Image */}
                <div className='sidebar-header'>
                    <img
                        src={saloon1} // Replace with the actual path of your logo/image
                        alt="Tanning Salon Logo"
                        className='sidebar-logo'
                    />
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
                                <FontAwesomeIcon icon={faLocationArrow} /> Locations
                            </NavLink>
                        </li>
                    )}
                    {loginUser?.role === 'admin' && (
                        <li>
                            <NavLink to='/users' activeClassName='active'>
                                <FontAwesomeIcon icon={faUser} /> System Users
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink to='/customers' activeClassName='active'>
                            <FontAwesomeIcon icon={faUsers} /> Customers
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

                    {/* Report section */}
                    {loginUser?.role === 'admin' && (
                        <li className='submenu-item'>
                            <div className='submenu-title' onClick={toggleCustomersReportSubmenu}>
                                <FontAwesomeIcon icon={faFileAlt} /> Reports
                                <FontAwesomeIcon
                                    icon={isCustomersReportSubmenuOpen ? faChevronUp : faChevronDown}
                                    className='submenu-icon'
                                />
                            </div>
                            {isCustomersReportSubmenuOpen && (
                                <ul className='submenu'>
                                    <li>
                                        <NavLink to='/allcustomers' activeClassName='active'>
                                            <FontAwesomeIcon icon={faUser} /> Customers Registered
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/topcustomers' activeClassName='active'>
                                            <FontAwesomeIcon icon={faUser} /> Top Customers
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/productreport' activeClassName='active'>
                                            <FontAwesomeIcon icon={faBox} /> Product Sales
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/purchasereport' activeClassName='active'>
                                            <FontAwesomeIcon icon={faCog} /> Service Sales
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/serviceused' activeClassName='active'>
                                            <FontAwesomeIcon icon={faChartLine} /> Usage
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
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
