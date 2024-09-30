/** @format */

import React, { useEffect } from 'react';
import HeaderWithSidebar from '../HeaderWithSidebar';
import ProductList from './ProductList';
import { useDispatch } from 'react-redux';
import { refreshProduct } from '../../slices/productSlice';

function Products() {
	const dispatch = useDispatch();
	useEffect(() => {
           dispatch(refreshProduct())
	},[])
	return (
		<div>
			<HeaderWithSidebar />
			<ProductList />
		</div>
	);
}

export default Products;
