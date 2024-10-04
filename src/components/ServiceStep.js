/** @format */

// ServiceStep.js

import React, { useEffect, useState } from "react";
import HeaderWithSidebar from "./HeaderWithSidebar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./ServiceStep.css";
import Modal from "../components/Modal";
import BuyProductModal from "./BuyProductModal";
import BuyServiceModal from "./BuyServiceModal";
import UseServiceModal from "./UseServiceModal";
import { refreshProduct } from "../slices/productSlice";
import { refreshService } from "../slices/serviceSlice";
import {
  createProductTransaction,
  getProductTransactionsByUser,
} from "../service/operations/productAndProductTransaction";
import {
  createServiceTransaction,
  getServiceTransactionsByUser,
  getServiceUseOptions,
  getTotalSpend,
} from "../service/operations/serviceAndServiceTransaction";
import { refreshCustomers } from "../slices/customerProfile";
import StatsHeader from "./StatsHeader";
import TopHeader from "./TopHeader";

const ServiceStep = ({ stats }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [buyProductModal, setBuyProductModal] = useState(false);
  const [buyServiceModal, setBuyServiceModal] = useState(false);
  const [useServiceModal, setUseServiceModal] = useState(false);
  const { customer } = useSelector((state) => state.customer);
  const { token } = useSelector((state) => state.auth);
  const { locations } = useSelector((state) => state.location);
  const [combinedTransactions, setCombinedTransactions] = useState([]); // Access the selected customer
  const [serviceUseOptions, setServiceUseOptions] = useState([]);
  useEffect(() => {
    dispatch(refreshProduct());
    dispatch(refreshService());
    dispatch(refreshCustomers());
    refreshTransactionOfCustomer();
  }, [dispatch]);

  const createProductTransactionOfUser = async (productId, quantity) => {
    try {
      const data = {
        user_id: customer.user.id, // Assuming user data is stored in auth state
        location_id: customer.profile?.preferred_location, // Replace with the correct location ID
        product_id: productId,
        quantity,
      };
      await createProductTransaction(token, data);
      refreshTransactionOfCustomer();
      // const { productTransactions } = await getProductTransactionsByUser(token, selectedUser?._id);
      // setProductTransactions(productTransactions);
      // console.log("Transaction created", response.data);
    } catch (err) {
      console.error("Error creating transaction", err);
    }
  }; // Store selected quantities for each product

  const createServiceTransactionOfUser = async (serviceId) => {
    try {
      const data = {
        user_id: customer.user.id,
        service_id: serviceId, // Assuming user data is stored in auth state
        location_id: customer.profile?.preferred_location, // Replace with the correct location ID
        type: "purchased",
      };
      await createServiceTransaction(token, data);
      refreshTransactionOfCustomer();
      dispatch(refreshCustomers());
    } catch (err) {
      console.error("Error creating transaction", err);
    }
  };

  const createServiceUseTransactionOfUser = async (serviceId) => {
    try {
      const data = {
        user_id: customer.user.id, // Assuming user data is stored in auth state
        location_id: customer.profile?.preferred_location,
        service_id: serviceId, // Replace with the correct location ID
        type: "used",
      };
      await createServiceTransaction(token, data);
      await getTotalSpend(token, customer.user.id);
      refreshTransactionOfCustomer();
      dispatch(refreshCustomers());
    } catch (err) {
      console.error("Error creating transaction", err);
    }
  };

  const refreshTransactionOfCustomer = async () => {
    try {
      // Fetch both product and service transactions concurrently
      const [serviceResponse, productResponse] = await Promise.all([
        getServiceTransactionsByUser(token, customer?.user.id),
        getProductTransactionsByUser(token, customer?.user.id),
      ]);
      console.log({ serviceResponse, productResponse });
      const serviceData = serviceResponse?.length > 0 ? serviceResponse : [];
      const productData = productResponse?.length > 0 ? productResponse : [];
      console.log({ serviceData: serviceData, productData: productData });
      // Map and structure service transactions
      const formattedServiceTransactions = serviceData.map((transaction) => ({
        id: transaction.transaction.id,
        productName: transaction?.service?.name, // For service, this might be the service name
        userName: `${transaction.user_details?.firstName} ${transaction.user_details?.lastName}`,
        quantity: transaction?.transaction?.quantity,
        price: transaction?.service?.price, // Service might not have a price, so defaulting to '-'
        location: transaction.user_details?.preferred_location?.name,
        type: transaction.transaction?.type === "used" ? "used" : "purchased",
        createdAt: transaction.transaction?.created_at,
      }));

      // Map and structure product transactions
      const formattedProductTransactions = productData.map((transaction) => ({
        id: transaction?.id,
        productName: transaction?.product?.productName, // For products, this is the product name
        userName: `${transaction.user?.firstName} ${transaction.user?.lastName}`,
        quantity: transaction?.quantity,
        price: transaction?.product?.price, // Product has a price
        location: transaction?.location?.name,
        type: transaction?.product?.type
          ? transaction?.product?.type
          : "product", // Assuming all product transactions are "Product"
        createdAt: transaction?.created_at,
      }));

      // Combine both sets of transactions
      const combined = [
        ...formattedServiceTransactions,
        ...formattedProductTransactions,
      ];
      console.log("combined data transaction", combined);
      setCombinedTransactions(
        combined.length > 0
          ? combined.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          : []
      );
    } catch (error) {
      console.log("Error getting transactions", error);
      setCombinedTransactions([]);
    }
  };

  const handleUseServiceModal = async () => {
    setUseServiceModal(true);
    try {
      const response = await getServiceUseOptions(token, customer.user.id);
      setServiceUseOptions(response);
    } catch (error) {
      console.log(error);
    }
  };

  const closeBuyProductModal = () => {
    setBuyProductModal(false);
  };

  const closeBuyServiceModal = () => {
    setBuyServiceModal(false);
  };

  const closeUseServiceModal = () => {
    setUseServiceModal(false);
  };

  return (
    <>
      <HeaderWithSidebar />
      {/* <StatsHeader stats={stats} /> */}
      <div className="service-wizard-container">
        {/* <h2 className="heading">Tanning Salon</h2> */}

        <div className="step-tabs">
          {/* <button
						onClick={() => navigate('/locationStep')}
						className='tab'
					>
						LOCATION
					</button> */}
          {/* <button
						className='tab'
						onClick={() => navigate('/about')}
					>
						ABOUT
					</button>
					<button className='tab active'>SERVICE</button> */}
        </div>

        {/* Display the selected customer information */}
        <div className="service-info">
          {customer ? (
            <div
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  padding: "10px",
                }}
              >
                <p>
                  <span>Name:</span> {customer.user.name}
                </p>
                <p>
                  <span>Phone Number:</span> {customer.profile?.phone_number}
                </p>
                <p>
                  <span>Gender:</span> {customer.profile?.gender}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  padding: "10px",
                }}
              >
                <p>
                  <span>Available Balance:</span>{" "}
                  {customer.profile?.available_balance}
                </p>
                <p>
                  <span>Total Spend:</span> {customer.profile?.total_spend}
                </p>
              </div>
            </div>
          ) : (
            <p>No customer selected</p>
          )}
          {customer && (
            <div className="use-btn">
              <button
                className="confirm-button"
                onClick={() => setBuyProductModal(true)}
              >
                Buy Product
              </button>
              <button
                className="confirm-button"
                onClick={() => setBuyServiceModal(true)}
              >
                Buy Service
              </button>
              {customer?.profile?.available_balance > 0 && (
                <button
                  className="confirm-button"
                  onClick={handleUseServiceModal}
                >
                  Use Service
                </button>
              )}
            </div>
          )}
        </div>
        <div className="transaction-container">
          <div className="transaction-table">
            <div className="transaction-table-header">
              <span>DATE/TIME</span>
              <span>TYPE</span>
              <span>PRODUCT / SERVICE</span>
              <span>QUANTITY</span>
              <span>PRICE</span>
            </div>
            <div className="transaction-table-wrapper">
              {/* Render filtered locations */}
              {combinedTransactions.length > 0 ? (
                combinedTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-table-row">
                    {/* <span>
                      {transaction?.userName ? transaction?.userName : "-"}
                    </span> */}
                    {/* <span>
                      {transaction?.location ? transaction?.location : "-"}
                    </span> */}
                    <span>
                      {transaction?.createdAt ? transaction?.createdAt : "-"}
                    </span>
                    <span>
                      <span className={`transaction-type ${transaction?.type}`}>
                        {transaction?.type
                          ? transaction?.type === "used"
                            ? "Used"
                            : transaction?.type === "purchased"
                            ? "Purchased"
                            : "Product"
                          : "-"}
                      </span>
                    </span>
                    <span>
                      {transaction.productName ? transaction?.productName : "-"}
                    </span>
                    <span className="price">
                      {transaction?.quantity ? transaction?.quantity : "-"}
                    </span>
                    <span className="price">
                      {
                        typeof transaction?.price === "number"
                          ? `£${transaction.price.toFixed(2)}`
                          : transaction?.price
                          ? `£${transaction.price}`
                          : "-" // If it's a string or not present
                      }
                    </span>
                  </div>
                ))
              ) : (
                <div className="transaction-table-row">
                  <span>No transaction found.</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {buyProductModal && (
          <Modal open={buyProductModal} setOpen={setBuyProductModal}>
            <BuyProductModal
              onClose={closeBuyProductModal}
              createProductTransactionOfUser={createProductTransactionOfUser}
            />
          </Modal>
        )}
        {buyServiceModal && (
          <Modal open={buyServiceModal} setOpen={setBuyServiceModal}>
            <BuyServiceModal
              createServiceTransactionOfUser={createServiceTransactionOfUser}
              onClose={closeBuyServiceModal}
            />
          </Modal>
        )}
        {useServiceModal && (
          <Modal open={useServiceModal} setOpen={setUseServiceModal}>
            <UseServiceModal
              serviceUseOptions={serviceUseOptions}
              onClose={closeUseServiceModal}
              createServiceUseTransactionOfUser={
                createServiceUseTransactionOfUser
              }
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default ServiceStep;
