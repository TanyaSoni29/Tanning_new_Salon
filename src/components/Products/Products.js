/** @format */

import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './ProductList';
import { useDispatch } from 'react-redux';
import { refreshProduct } from '../../slices/productSlice';

function Products({ selectedLoginLocation }) {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(refreshProduct());
	}, []);
	return (
		<div>
			<HeaderWithSidebar />
			<ProductList selectedLoginLocation={selectedLoginLocation} />
		</div>
	);
}

export default Products;
