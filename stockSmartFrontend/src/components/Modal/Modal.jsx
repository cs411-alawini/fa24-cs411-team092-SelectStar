import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, schema, formData, onSubmit }) => {
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    if (formData && formData[schema]) {
      setLocalFormData(formData[schema]); // Only update if formData is defined
    }
  }, [formData, schema]);

  const handleChange = (e, field, index) => {
    const value = e.target.value;
    setLocalFormData((prevData) => {
      if (schema === 'Order' && field === 'Inventories') {
        const updatedInventories = [...prevData.Order.Inventories];
        updatedInventories[index][e.target.name] = value;
        return { ...prevData, Order: { ...prevData.Order, Inventories: updatedInventories } };
      }
      return { ...prevData, [schema]: { ...prevData[schema], [field]: value } };
    });
  };

  const addInventory = () => {
    setLocalFormData((prevData) => {
      const updatedInventories = [...prevData.Order.Inventories, { InventoryId: '', Quantity: '' }];
      return { ...prevData, Order: { ...prevData.Order, Inventories: updatedInventories } };
    });
  };

  const removeInventory = (index) => {
    setLocalFormData((prevData) => {
      const updatedInventories = prevData.Order.Inventories.filter((_, i) => i !== index);
      return { ...prevData, Order: { ...prevData.Order, Inventories: updatedInventories } };
    });
  };

  const handleSubmit = () => {
    onSubmit(localFormData[schema]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add {schema}</h2>
        <form>
          {Object.keys(localFormData).map((field, index) => {
            if (field === 'Inventories') {
              return (
                <div key={index} className="form-group">
                  <label style={{display: "block"}}>Inventories</label>
                  {localFormData[field].map((inventory, idx) => (
                    <div key={idx} className="inventory-entry">
                      <input
                        type="text"
                        name="InventoryId"
                        value={inventory.InventoryId}
                        onChange={(e) => handleChange(e, field, idx)}
                        placeholder="InventoryId"
                      />
                      <input
                        type="number"
                        name="Quantity"
                        value={inventory.Quantity}
                        onChange={(e) => handleChange(e, field, idx)}
                        placeholder="Quantity"
                      />
                      <button type="button" onClick={() => removeInventory(idx)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="arrayButton" onClick={addInventory}>Add Inventory</button>
                </div>
              );
            }
            return (
               
              <div key={index} className="form-group">
                 {console.log(field)}
                <label>{field}</label>
                <input
                  type="text"
                  value={localFormData[field]}
                  onChange={(e) => handleChange(e, field)}
                  placeholder={field}
                />
              </div>
            );
          })}
          <button type="button" className="submit-button" onClick={handleSubmit}>
            Add
          </button>
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
