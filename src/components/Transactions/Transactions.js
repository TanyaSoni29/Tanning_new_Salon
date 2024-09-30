/** @format */

import React from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import TransactionList from './TransactionList';

function Transactions() {
	return (
		<div>
			<HeaderWithSidebar />
			<TransactionList />
		</div>
	);
}

export default Transactions;
