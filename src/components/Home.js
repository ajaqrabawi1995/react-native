import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

import package1 from '../assets/packages.jpg';
import package2 from '../assets/packeges2.jpg';
import package3 from '../assets/packeges3.jpg';

const packageImages = {
  package1,
  package2,
  package3,
};

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [imageIndex, setImageIndex] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/packages', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPackages(response.data);
      const initialImageIndex = response.data.reduce((acc, pkg) => {
        acc[pkg._id] = 0; // Initialize index for each package to 0
        return acc;
      }, {});
      setImageIndex(initialImageIndex);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();

    const interval = setInterval(() => {
      setImageIndex(prevIndex => {
        const updatedIndex = { ...prevIndex };
        Object.keys(updatedIndex).forEach(pkgId => {
          updatedIndex[pkgId] = (updatedIndex[pkgId] + 1) % Object.keys(packageImages).length;
        });
        return updatedIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (pkg) => {
    setCurrentPackage(pkg);
    setShowModal(true);
  };

  return (
    <div className="container" style={{ paddingTop: '70px' }}>
      <header style={{ position: 'fixed', top: '0', left: '0', right: '0', backgroundColor: '#f8f9fa', padding: '10px', zIndex: '1000' }}>
        <h2 className="text-center">Available Packages</h2>
      </header>

      <div style={{ marginTop: '70px', padding: '20px' }}>
     
        <div className="row">
          {packages.map(pkg => (
            <div className="col-md-4 mb-4 d-flex" key={pkg._id}>
              <div
                className="card shadow-sm"
                onClick={() => handleCardClick(pkg)}
                style={{ display: 'flex', flexDirection: 'column', height: '250px', width: '250px', justifyContent: 'flex-start', margin: '0 auto' }}
              >
                <img
                  src={packageImages[`package${imageIndex[pkg._id] + 1}`] || packageImages.package1}
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
          <Modal.Title>{currentPackage?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Total Price: ${currentPackage?.totalPrice}</h5>
          <h6>Included Items:</h6>
          {currentPackage?.items && currentPackage.items.length > 0 ? (
            <div className="row">
              {currentPackage.items.map(item => (
                <div key={item._id} className="col-md-4 mb-3">
                  <div className="card">
                  <img
                      src={`http://localhost:5000/${item.image}`|| 'path/to/default/image.jpg'} // Fallback image
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: '100px', objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'path/to/default/image.jpg'; }} // Fallback if image fails to load
                    />
                    <div className="card-body text-center">
                      <h6 className="card-title">{item.name}</h6>
                      <p>Price: ${item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items included in this package.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
