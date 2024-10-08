/** @format */

import React, { useEffect } from "react";
import HeaderWithSidebar from "../HeaderWithSidebar";
import ProductList from "./CurrentmonthList";
import { useDispatch } from "react-redux";
import { refreshCustomers } from "../../slices/customerProfile";
import { refreshLocation } from "../../slices/locationSlice";

function TopCustomer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshCustomers());
    dispatch(refreshLocation());
  }, [dispatch]);

  return (
    <div>
      <HeaderWithSidebar />
      <ProductList />
    </div>
  );
}

export default TopCustomer;
