import React from 'react';

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="text-center">
        <div className="loading-spinner-wrap position-relative mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
          <div className="spinner-border text-success" role="status" style={{ width: '80px', height: '80px', borderWidth: '5px', opacity: 0.2 }}></div>
          <div className="spinner-border text-success position-absolute top-0 start-0" role="status" style={{ width: '80px', height: '80px', borderWidth: '5px', borderTopColor: 'transparent', animationDuration: '0.8s' }}></div>
          <div className="position-absolute top-50 start-50 translate-middle">
            <i className="fas fa-shopping-basket text-success fs-4 opacity-75"></i>
          </div>
        </div>
        <h5 className="fw-bold text-dark mb-1">Loading FreshCart</h5>
        <p className="small text-muted mb-0 opacity-75">Fetching the freshest products for you...</p>
      </div>
    </div>
  );
}
