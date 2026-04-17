import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import toast from 'react-hot-toast';

export default function QuickView({ product, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [addingCart, setAddingCart] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !animate) return null;

  async function handleAddToCart() {
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    setAddingCart(true);
    try {
      await dispatch(addToCart(product._id)).unwrap();
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err || 'An error occurred');
    } finally {
      setAddingCart(false);
    }
  }

  return createPortal(
    <div className={`quickview-overlay ${animate ? 'active' : ''}`} onClick={onClose}>
      <div className={`quickview-modal ${animate ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="qv-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="container-fluid p-0">
          <div className="row g-0">
            {/* Left: Image Section */}
            <div className="col-md-6 qv-image-col">
              <div className="qv-img-wrapper">
                <img src={product.imageCover} alt={product.title} className="img-fluid" />
                {product.priceAfterDiscount && (
                  <span className="qv-discount-badge">
                    -{Math.round((1 - product.priceAfterDiscount / product.price) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Right: Info Section */}
            <div className="col-md-6 qv-info-col p-4 p-lg-5">
              <span className="text-success fw-bold small mb-2 d-block text-uppercase ls-wide">
                {product.category?.name}
              </span>
              <h2 className="fw-bold mb-3 display-6" style={{ fontSize: '1.75rem' }}>{product.title}</h2>
              
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="text-warning d-flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <i key={star} className={`fas fa-star ${star <= Math.round(product.ratingsAverage) ? '' : 'opacity-25'}`}></i>
                  ))}
                </div>
                <span className="text-muted small">({product.ratingsQuantity} reviews)</span>
              </div>

              <div className="mb-4 d-flex align-items-baseline gap-3">
                <span className="fs-2 fw-bold text-dark">{product.priceAfterDiscount || product.price} EGP</span>
                {product.priceAfterDiscount && (
                  <span className="text-muted text-decoration-line-through fs-5">{product.price} EGP</span>
                )}
              </div>

              <p className="text-muted mb-4 lh-lg" style={{ fontSize: '0.95rem' }}>
                {product.description || 'No description available for this premium product. Experience the best quality with FreshCart.'}
              </p>

              <div className="qv-actions mt-auto pt-4 border-top">
                <button 
                  className="btn btn-success btn-lg rounded-pill px-5 py-3 w-100 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  onClick={handleAddToCart}
                  disabled={addingCart}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {addingCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>

              <div className="mt-4 pt-2">
                <div className="d-flex align-items-center gap-3 text-muted small">
                  <div className="d-flex align-items-center gap-1">
                    <i className="fas fa-shield-check text-success"></i> 100% Authentic
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <i className="fas fa-truck text-success"></i> Free Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .quickview-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          transition: background 0.3s ease;
          pointer-events: none;
        }
        .quickview-overlay.active {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          pointer-events: auto;
        }
        .quickview-modal {
          background: white;
          width: 100%;
          max-width: 950px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          transform: scale(0.9) translateY(20px);
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .quickview-modal.active {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        .qv-close-btn {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
          color: #1a1a2e;
        }
        .qv-close-btn:hover {
          background: #f8f9fa;
          transform: rotate(90deg);
          color: #dc3545;
        }
        .qv-image-col {
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        .qv-img-wrapper {
          padding: 40px;
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qv-img-wrapper img {
          max-height: 450px;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .qv-discount-badge {
          position: absolute;
          top: 30px;
          left: 30px;
          background: #dc3545;
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 0.85rem;
        }
        .qv-info-col {
          display: flex;
          flex-direction: column;
          max-height: 80vh;
          overflow-y: auto;
        }
        .ls-wide { letter-spacing: 0.05em; }
        
        @media (max-width: 768px) {
          .quickview-modal {
            max-width: 100%;
            height: 90vh;
          }
          .qv-image-col {
            min-height: 300px;
          }
          .qv-img-wrapper img {
            max-height: 250px;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
