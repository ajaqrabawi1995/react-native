// components/ItemsManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemsManagement = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState(''); // New state for item type
  const [image, setImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('weight', weight);
    formData.append('price', price);
    formData.append('type', type); // Append type to form data
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const editItem = (item) => {
    setEditingItem(item);
    setName(item.name);
    setWeight(item.weight);
    setPrice(item.price);
    setType(item.type); // Set type for editing
    setImage(null);
  };

  const updateItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('weight', weight);
    formData.append('price', price);
    formData.append('type', type); // Append type to form data
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:5000/api/items/${editingItem._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setWeight('');
    setPrice('');
    setType(''); // Reset type field
    setImage(null);
    setEditingItem(null);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '70px' }}> {/* Space for fixed header */}
      {/* Fixed Header */}
      <header style={{ 
          position: 'fixed', 
          top: '0', 
          left: '0', 
          right: '0', 
          zIndex: '1000', 
          backgroundColor: '#f8f9fa', 
          padding: '10px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
      }}>
        <h2 className="text-center mb-0">Items Management</h2>
      </header>

      {/* Scrollable Content Wrapper */}
      <div style={{ 
          marginTop: '70px', // Match the height of the fixed header
          padding: '20px', // Optional padding for content
          height: 'calc(100vh - 70px)', // Fill the remaining viewport height
          overflowY: 'auto' // Allow vertical scrolling
      }}>
        {/* Item Entry Section */}
        <div className="item-entry-container mb-5"> 
          <form onSubmit={editingItem ? updateItem : addItem}>
            <div className="row">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Item Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="file"
                  className="form-control"
                  accept="image/jpeg" // Accept only JPEG files
                  onChange={(e) => setImage(e.target.files[0])}
                  required={!editingItem}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-3">
                <select
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select Item Type</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Vegetable">Vegetable</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </form>
        </div>

        {/* Items Table Section */}
        <div className="table-responsive mb-5">
          <h3 className="my-4">Items List</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Weight (kg)</th>
                <th>Price ($)</th>
                <th>Type</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.weight}</td>
                  <td>{item.price}</td>
                  <td>{item.type}</td>
                  <td>
                    <img
                      src={`http://localhost:5000/${item.image}`} // Adjust this based on your backend setup
                      alt={item.name}
                      style={{ width: '50px', height: '50px' }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-warning" onClick={() => editItem(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteItem(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsManagement;
