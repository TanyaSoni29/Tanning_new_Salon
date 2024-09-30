/** @format */

import React, { useEffect } from "react";
import HeaderWithSidebar from "../HeaderWithSidebar";
import CustomerList from "./CustomerList";
import { useDispatch } from "react-redux";
import { refreshCustomers } from "../../slices/customerProfile";

function Customers() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshCustomers());
  }, [dispatch]);
  return (
    <div>
      <HeaderWithSidebar />
      <CustomerList />
    </div>
  );
}

export default Customers;
