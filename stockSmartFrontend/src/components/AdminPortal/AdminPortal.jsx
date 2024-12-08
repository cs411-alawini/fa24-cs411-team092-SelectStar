import React, { useState, useEffect } from "react";
import "./AdminPortal.css";
import Sidebar from "../Sidebar/Sidebar";
import DataTable from "../DataTable/DataTable";
import Modal from "../Modal/Modal";

const AdminPortal = () => {
  const [selectedSchema, setSelectedSchema] = useState("Category");
  const [data, setData] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [formData, setFormData] = useState({});
  const [fieldSuggestions, setFieldSuggestions] = useState([]);

  const schemaFields = {
    Category: ["Name", "LeadTime (yyyy-mm-dd)", "StorageRequirements"],
    Product: ["Name", "PackagingType", "Weight", "CategoryId", "SupplierId"],
    Inventory: ["StockDate (yyyy-mm-dd)", "ProductId", "UnitPrice", "ManufactureDate (yyyy-mm-dd)", "ExpiryDate (yyyy-mm-dd)", "Quantity"],
    Supplier: ["Name", "Address", "Contact"],
    "Promotional Offer": ["StartDate (yyyy-mm-dd)", "EndDate (yyyy-mm-dd)", "DiscountRate"],
    "Admin User": ["EmailId", "Password", "Type", "FirstName", "LastName", "PhoneNumber"],
    Order: ["OrderDate (yyyy-mm-dd)", "Inventories"],  // Updated for Order
  };

  const fieldDefaults = {
    Category: { Name: "", "LeadTime (yyyy-mm-dd)": "", StorageRequirements: "" },
    Product: { Name: "", PackagingType: "", Weight: "", CategoryId: "", SupplierId: "" },
    Inventory: { "StockDate (yyyy-mm-dd)": "", ProductId: "", UnitPrice: "", "ManufactureDate (yyyy-mm-dd)": "", "ExpiryDate (yyyy-mm-dd)": "", Quantity: "" },
    Supplier: { Name: "", Address: "", Contact: "" },
    "Promotional Offer": { "StartDate (yyyy-mm-dd)": "", "EndDate (yyyy-mm-dd)": "", DiscountRate: ""},
    "Admin User": { EmailId: "", Password: "", Type: "", FirstName: "", LastName: "", PhoneNumber: "" },
    Order: { "OrderDate (yyyy-mm-dd)": "", Inventories: [] },  // Order format with Inventories
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/${selectedSchema}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    setFormData(fieldDefaults[selectedSchema] || {}); // Ensure formData is correctly set based on schema
    setFieldSuggestions(schemaFields[selectedSchema] || []);
  }, [selectedSchema]);

  const handleAdd = async (newRow) => {
    try {
      const response = await fetch(`/api/${selectedSchema}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });
      const result = await response.json();
      setResponseMessage(result.message || "Row added successfully!");
      fetchData();
    } catch (error) {
      setResponseMessage("Error adding row.");
    }
    setShowModal(false); // Close the modal after adding the entry
  };

  const handleUpdate = async (id, updatedRow) => {
    try {
      const response = await fetch(`/api/${selectedSchema}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRow),
      });
      const result = await response.json();
      setResponseMessage(result.message || "Row updated successfully!");
      fetchData();
    } catch (error) {
      setResponseMessage("Error updating row.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/${selectedSchema}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      setResponseMessage(result.message || "Row deleted successfully!");
      fetchData();
    } catch (error) {
      setResponseMessage("Error deleting row.");
    }
  };

  return (
    <div className="admin-portal">
      <Sidebar
        schemas={["Category", "Product", "Inventory", "Order", "Supplier", "Promotional Offer", "Admin User"]}
        setSelectedSchema={setSelectedSchema}
      />
      <div className="main-content">
        <h1>{selectedSchema}</h1>
        <button
          className="add-button"
          onClick={() => setShowModal(true)} // Open modal when clicked
        >
          Add New {selectedSchema}
        </button>
        <DataTable
          data={data}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        {showModal && (
          <Modal
            isOpen={showModal} // Use the isOpen prop
            onClose={() => setShowModal(false)} // Close modal function
            schema={selectedSchema}
            formData={formData} // Pass the form data
            onSubmit={handleAdd} // Pass the onSubmit handler
          />
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
