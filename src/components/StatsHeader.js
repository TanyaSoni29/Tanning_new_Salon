/** @format */

import React from 'react';

import { FaUserFriends } from 'react-icons/fa'; // Import necessary icons
import { MdOutlineToday } from 'react-icons/md'; // Import Today Users Icon
import { AiFillDollarCircle } from 'react-icons/ai'; // Import Revenue Icon
import './StatsHeader.css';
function StatsHeader() {
	

	return (
		<div>
			<div className='stats-wizard-container'>
				<div className='stats-section'>
					<div className='stat-box'>
						<div className='icon-container'>
							<FaUserFriends
								size={40}
								color='#f54291'
							/>
						</div>
						<div className='stats-info'>
							<h3>0</h3>
							<p>Total Users</p>
						</div>
					</div>
					<div className='stat-box'>
						<div className='icon-container'>
							<MdOutlineToday
								size={40}
								color='#007bff'
							/>
						</div>
						<div className='stats-info'>
							<h3>0</h3>
							<p>Today's Users</p>
						</div>
					</div>
					<div className='stat-box'>
						<div className='icon-container'>
							<AiFillDollarCircle
								size={40}
								color='#28a745'
							/>
						</div>
						<div className='stats-info'>
							<h3>34k</h3>
							<p>Revenue</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StatsHeader;
