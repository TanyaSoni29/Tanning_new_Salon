/** @format */

import React from 'react';

import { FaUserFriends } from 'react-icons/fa'; // Import necessary icons
import { BsClockHistory } from 'react-icons/bs'; // Import Today Users Icon
import { AiFillPoundCircle } from 'react-icons/ai'; // Import Revenue Icon
import './StatsHeader.css';
function StatsHeader({ stats }) {
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
							<h3>{stats?.customers}</h3>
							<p> Customer Registered </p>
						</div>
					</div>
					<div className='stat-box'>
						<div className='icon-container'>
							<AiFillPoundCircle
								size={40}
								color='#28a745'
							/>
						</div>
						<div className='stats-info'>
							<h3>£{stats?.productTransactionTotalToday?.toFixed(2)}</h3>
							<p> Sales Today</p>
						</div>
					</div>
					<div className='stat-box'>
						<div className='icon-container'>
							<BsClockHistory
								size={40}
								color='#007bff'
							/>
						</div>
						<div className='stats-info'>
							<h3>{stats?.serviceTransactionTotalToday}</h3>
							<p>Minutes Used Today</p>
						</div>
					</div>
					{/* <div className='stat-box'>
						<div className='icon-container'>
							<AiFillDollarCircle
								size={40}
								color='#28a745'
							/>
						</div>
						<div className='stats-info'>
							<h3>{stats?.serviceTransactionTotalToday}</h3>
							<p>Today's Service Revenue</p>
						</div>
					</div> */}
				</div>
			</div>
		</div>
	);
}

export default StatsHeader;
