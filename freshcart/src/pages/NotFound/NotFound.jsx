import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #f0fdf0, #e8f5e9)' }}>
      <div className="text-center px-4">
        <div className="not-found-num">404</div>
        <h2 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>Page Not Found</h2>
        <p className="text-muted mb-4">It looks like the page you're looking for doesn't exist or has been moved.</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn btn-success rounded-pill px-5 py-2 fw-bold">
            <i className="fas fa-home me-2"></i>Back to Home
          </Link>
          <Link to="/products" className="btn btn-outline-success rounded-pill px-5 py-2 fw-bold">
            <i className="fas fa-store me-2"></i>Browse Products
          </Link>
        </div>
      </div>

      <style>{`
        .not-found-num {
          font-size: clamp(6rem, 15vw, 10rem);
          font-weight: 900;
          background: linear-gradient(135deg, #0aad0a, #088a08);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          margin-bottom: 20px;
          text-shadow: none;
        }
      `}</style>
    </div>
  );
}
