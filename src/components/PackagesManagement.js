import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

import package1 from '../assets/packages.jpg';
import package2 from '../assets/packeges2.jpg';
import package3 from '../assets/packeges3.jpg';

const packageImages = {
  package1: package1,
  package2: package2,
  package3: package3,
};

const PackagesManagement = () => {
  const [packages, setPackages] = useState([]);
  const [items, setItems] = useState([]);
  const [newPackageName, setNewPackageName] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [itemToAdd, setItemToAdd] = useState('');

  const getToken = () => localStorage.getItem('token');

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/packages', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const createPackage = async () => {
    if (newPackageName && selectedItems.length > 0) {
      const itemIds = selectedItems.map(item => item._id);
      try {
        await axios.post('http://localhost:5000/api/packages', {
          name: newPackageName,
          items: itemIds, // Include selected items in the new package
        }, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setNewPackageName(''); // Reset input field
        setSelectedItems([]); // Reset selected items
        fetchPackages(); // Refresh package list
      } catch (error) {
        console.error('Error creating package:', error);
      }
    }
  };

  const deletePackage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/packages/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchPackages();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const handleCardClick = (pkg) => {
    setCurrentPackage(pkg);
    setSelectedItems(pkg.items);
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const addItemToPackage = () => {
    if (itemToAdd) {
      const itemToAddObject = items.find(item => item._id === itemToAdd);
      if (itemToAddObject && !selectedItems.some(item => item._id === itemToAdd)) {
        const updatedItems = [...selectedItems, itemToAddObject];
        setSelectedItems(updatedItems);
      }
      setItemToAdd('');
    }
  };

  const removeItemFromPackage = (itemId) => {
    const updatedItems = selectedItems.filter(item => item._id !== itemId);
    setSelectedItems(updatedItems);
  };

  const updatePackageItems = async () => {
    const updatedPackageData = {
      name: currentPackage.name,
      items: selectedItems.map(item => item._id),
    };

    try {
      await axios.put(`http://localhost:5000/api/packages/${currentPackage._id}`, updatedPackageData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchPackages();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchItems();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '70px' }}>
      <header style={{ position: 'fixed', top: '0', left: '0', right: '0', backgroundColor: '#f8f9fa', padding: '10px', zIndex: '1000' }}>
        <h2 className="text-center">Package Management</h2>
      </header>

      <div style={{ marginTop: '70px', overflowY: 'auto', position: 'relative' }}>
        
        {/* New Package Creation Form */}
        <div className="mb-5" >
          <h3>Create New Package</h3>
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Package Name"
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={createPackage}>Create Package</button>
          </div>

          <label>Add Items to Package:</label>
          <select
            className="form-control mb-3"
            value={itemToAdd}
            onChange={(e) => setItemToAdd(e.target.value)}
          >
            <option value="">Select an item</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>
                {item.name} - ${item.price}
              </option>
            ))}
          </select>
          <button className="btn btn-success" onClick={addItemToPackage}>
            Add Item
          </button>

          {selectedItems.length > 0 && (
            <div className="mt-3">
              <h5>Selected Items:</h5>
              <ul className="list-group">
                {selectedItems.map(item => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name}
                    <button className="btn btn-danger btn-sm" onClick={() => removeItemFromPackage(item._id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <h3>Packages List</h3>
        <div className="row">
          {packages.map((pkg) => (
            <div className="col-md-4 mb-4 d-flex" key={pkg._id}>
              <div
                className="card shadow-sm"
                onClick={() => handleCardClick(pkg)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '250px', // Set fixed height for square cards
                  width: '250px', // Set fixed width for square cards
                  justifyContent: 'flex-start',
                  position: 'relative',
                  margin: '0 auto', // Center the cards
                }}
              >
                <img
                  src={packageImages[pkg.image] || packageImages.package1} // Use a default image if none is found
                  alt={pkg.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '5px',
                    borderTopRightRadius: '5px',
                  }}
                />
                <div className="card-body text-center" style={{ flexGrow: 1 }}>
                  <h5 className="card-title">{pkg.name}</h5>
                  <strong>Total Price: </strong>${pkg.totalPrice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Items in {currentPackage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Total Price: ${currentPackage?.totalPrice}</h5>
          <div className="mb-3">
            <label>Add Item to Package:</label>
            <select
              className="form-control"
              value={itemToAdd}
              onChange={(e) => setItemToAdd(e.target.value)}
            >
              <option value="">Select an item</option>
              {items.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name} - ${item.price}
                </option>
              ))}
            </select>
            <button className="btn btn-success mt-2" onClick={addItemToPackage}>
              Add Item
            </button>
          </div>

          {selectedItems.length > 0 ? (
            <div>
              <h5>Current Items:</h5>
              <ul className="list-group">
                {selectedItems.map(item => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name}
                    <button className="btn btn-danger btn-sm" onClick={() => removeItemFromPackage(item._id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No items in this package.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
          <button className="btn btn-danger" onClick={() => deletePackage(currentPackage._id)}>
            Delete Package
          </button>
          <button className="btn btn-primary" onClick={updatePackageItems}>
            Update Package
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PackagesManagement;
