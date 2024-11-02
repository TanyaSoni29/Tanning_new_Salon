import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./BuyProductModal.css";
import toast from "react-hot-toast";
import { refreshProduct } from "../slices/productSlice";
import { refreshLocation } from "../slices/locationSlice";

function BuyProductModal({
  onClose,
  createProductTransactionOfUser,
  selectedLoginLocation,
}) {
  const { products } = useSelector((state) => state.product);
  const { locations } = useSelector((state) => state.location);
  const [searchTerm, setSearchTerm] = useState("");

  const locationDetails = locations.find(
    (location) => location.id === selectedLoginLocation
  );
  const dispatch = useDispatch();

  // Initialize selectedQuantities as an object keyed by product ID for more reliable access
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  const filteredProducts = products?.filter((product) =>
    product?.name?.toLowerCase().includes(normalizedSearchTerm)
  );

  useEffect(() => {
    dispatch(refreshProduct());
    dispatch(refreshLocation());
  }, [dispatch]);

  const getStockFieldForLocation = (locationId) => {
    return `stock${locationId}`;
  };

  // Handle quantity change by using product ID as the key
  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };

  // Handle the submit action
  const handleBuy = () => {
    const hasSelectedQuantity = Object.values(selectedQuantities).some(
      (quantity) => quantity > 0
    );

    if (!hasSelectedQuantity) {
      toast.error("Please select at least one quantity!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    filteredProducts.forEach((product) => {
      const quantity = selectedQuantities[product.id] || 0;
      if (quantity > 0) {
        createProductTransactionOfUser(product.id, quantity);
      }
    });

    setSelectedQuantities({}); // Reset the quantities after purchase
    onClose(); // Close the modal after buying
  };

  return (
    <div className="Buyproduct-modal-container">
      <h2 className="Buyproduct-modal-header">Products</h2>
      <input
        type="text"
        placeholder="Search"
        className="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="Buyproducts-table">
        <div className="Buyproducts-table-header">
          <span>Product Name</span>
          <span>Price</span>
          <span>Avail. Quan.</span>
          <span>Quantity</span>
        </div>

        {/* Render products */}
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product) => {
            const stockField = getStockFieldForLocation(
              locationDetails?.location_id
            );
            const availableStock = product[stockField] || 0; // Default to 0 if stock is undefined

            return (
              <div key={product?.id} className="Buyproducts-table-row">
                <span className="Buyproduct-name">{product?.name}</span>
                <span>£{product?.price}</span>
                <span>{availableStock}</span>
                <span>
                  <select
                    value={selectedQuantities[product.id] || 0}
                    onChange={(e) =>
                      handleQuantityChange(product.id, parseInt(e.target.value))
                    }
                    className="quantity-select"
                  >
                    {/* Ensure availableStock is valid by adding fallback to 0 */}
                    {[...Array(Math.max(availableStock, 0) + 1).keys()].map((quantity) => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
            );
          })
        ) : (
          <div className="Buyproducts-table-row">
            <span>No products found.</span>
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button className="buy-button" onClick={handleBuy}>
          Buy
        </button>
      </div>
    </div>
  );
}

export default BuyProductModal;
