import React, { useState } from "react";
import "./ProductList.css"; // Importing CSS
import { useDispatch, useSelector } from "react-redux";
import { removeProduct, refreshProduct } from "../../slices/productSlice";
import { deleteProduct } from "../../service/operations/productAndProductTransaction";
import Modal from "../Modal";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import { formatDate } from "../../utils/formateDate";

const ProductList = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth); // Assuming token is stored in auth slice
  const { products = [] } = useSelector((state) => state.product); // Ensure products is always an array, defaulting to []

  // console.log('products List---', products);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false); // Control delete modal/confirmation
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null); // Track the product to be deleted or edited

  // Filter products based on search term
  const filteredProducts = products?.filter((product) =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle the delete action with API call and Redux update
  const handleDelete = async (productId) => {
    try {
      // Call delete API
      const result = await deleteProduct(token, productId);

      // If deletion was successful, update the Redux state
      if (result) {
        dispatch(removeProduct(productId));
        dispatch(refreshProduct()); // Refresh products after deletion
        setIsDeleteOpen(false);
      }
    } catch (error) {
      console.error("Error during Product deletion:", error);
    } finally {
      setIsDeleteOpen(false); // Close delete modal/confirmation dialog
    }
  };

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const handleEdit = (product) => {
    setIsEditOpen(true);
    setActiveProduct(product); // Set the product to be edited
  };

  // Handle opening the delete confirmation/modal
  const confirmDelete = (product) => {
    setActiveProduct(product);
    setIsDeleteOpen(true); // Show delete confirmation modal
  };

  // Handle closing the delete confirmation/modal
  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setActiveProduct(null); // Reset active Product
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setActiveProduct(null); // Reset active Product
  };

  const closeAddModal = () => {
    setIsAddOpen(false);
  };

  return (
    <div className="products-container">
      <div className="products-search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-button1" onClick={handleAdd}>
          Add New Product
        </button>
      </div>

      <div className="product-table">
        <div className="products-table-header">
          <span>Product Name</span>
          <span>Price</span>
          <span>Listed On</span>
          <span>Action</span>
        </div>

        {/* Render filtered products */}
        {filteredProducts?.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product?.id} className="products-table-row">
              <span>{product?.name}</span>
              <span className="productprice">£{product?.price}</span>
              <span>{formatDate(product?.created_at)}</span>
              <span>
                <i
                  className="fa fa-pencil"
                  onClick={() => handleEdit(product)}
                ></i>
                <i
                  className="fa fa-trash"
                  onClick={() => confirmDelete(product)} // Open delete modal
                ></i>
              </span>
            </div>
          ))
        ) : (
          <div className="products-table-row">
            <span>No products found.</span>
          </div>
        )}
      </div>

      {isAddOpen && (
        <Modal setOpen={setIsAddOpen} open={isAddOpen}>
          <AddProductModal closeAddModal={closeAddModal} />
        </Modal>
      )}

      {/* Delete Confirmation Modal/Alert */}
      {isDeleteOpen && activeProduct && (
        <Modal setOpen={setIsDeleteOpen} open={isDeleteOpen}>
          <DeleteProductModal
            handleDelete={handleDelete}
            activeProduct={activeProduct}
            closeDeleteModal={closeDeleteModal}
          />
        </Modal>
      )}

      {isEditOpen && activeProduct && (
        <Modal setOpen={setIsEditOpen} open={isEditOpen}>
          <EditProductModal
            activeProduct={activeProduct}
            closeEditModal={closeEditModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductList;

// DeleteProductModal Component
function DeleteProductModal({ handleDelete, activeProduct, closeDeleteModal }) {
  return (
    <div className="delete-modal">
      <p>Are you sure you want to delete {activeProduct?.name}?</p>
      <div className="button-container">
        <button
          onClick={() => handleDelete(activeProduct?.id)}
          className="confirm-button"
        >
          Confirm
        </button>
        <button className="cancel-button" onClick={closeDeleteModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}
