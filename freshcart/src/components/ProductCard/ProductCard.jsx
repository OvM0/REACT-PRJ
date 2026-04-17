import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/wishlistSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { wishlistIds } = useSelector(state => state.wishlist);
  const [addingCart, setAddingCart] = useState(false);
  const [addingWish, setAddingWish] = useState(false);

  const isWishlisted = wishlistIds.includes(product._id);

  async function handleAddToCart(e) {
    e.preventDefault();
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

  async function handleWishlist(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login first');
      return;
    }
    setAddingWish(true);
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err || 'An error occurred');
    } finally {
      setAddingWish(false);
    }
  }

  const discount = product.priceAfterDiscount
    ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
    : null;

  return (
    <div className="product-card-exact card border-light h-100 position-relative bg-white shadow-sm overflow-hidden">
      {/* Discount Badge - Top Left */}
      {discount && (
        <span className="badge bg-danger rounded-0 position-absolute start-0 top-0 m-2 px-2 py-1" style={{ zIndex: 10, fontSize: '0.65rem' }}>
          -{discount}%
        </span>
      )}

      {/* Floating Action Bar - Right Side */}
      <div className="card-actions-float-exact">
        <button className="action-circle-btn-exact" onClick={handleWishlist} disabled={addingWish}>
          <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`} style={{ color: isWishlisted ? '#e74c3c' : '#adb5bd' }}></i>
        </button>
        <button className="action-circle-btn-exact"><i className="fas fa-arrows-rotate"></i></button>
        <Link to={`/products/${product._id}`} className="action-circle-btn-exact text-decoration-none">
          <i className="far fa-eye"></i>
        </Link>
      </div>

      <Link to={`/products/${product._id}`} className="text-decoration-none h-100 d-flex flex-column">
        <div className="p-4 text-center">
          <img
            src={product.imageCover}
            alt={product.title}
            className="img-fluid"
            style={{ height: '180px', objectFit: 'contain' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'; }}
          />
        </div>

        <div className="card-body px-3 pb-3 pt-0 d-flex flex-column">
          <p className="text-muted small mb-1" style={{ fontSize: '0.75rem' }}>
            {product.category?.name || 'Category'}
          </p>
          <h6 className="card-title text-truncate fw-bold mb-1" style={{ color: '#2d3436', fontSize: '1rem' }}>
            {product.title}
          </h6>
          
          <div className="d-flex align-items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <i key={star} className={`fas fa-star ${star <= Math.round(product.ratingsAverage) ? 'text-warning' : 'text-light'}`} style={{ fontSize: '0.8rem' }}></i>
            ))}
            <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>{product.ratingsAverage?.toFixed(1)} ({product.ratingsQuantity || 0})</span>
          </div>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className="lh-1">
              <span className="fw-bold text-dark fs-4">
                {product.priceAfterDiscount || product.price} EGP
              </span>
              {product.priceAfterDiscount && (
                <div className="text-muted text-decoration-line-through mt-1" style={{ fontSize: '0.8rem' }}>
                  {product.price} EGP
                </div>
              )}
            </div>
            
            <button
              className="btn btn-plus-exact rounded-circle d-flex align-items-center justify-content-center"
              onClick={handleAddToCart}
              disabled={addingCart}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card-exact { border-radius: 12px !important; border-color: #f1f1f1 !important; transition: all 0.3s; }
        .product-card-exact:hover { border-color: #0aad0a !important; box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }
        .card-actions-float-exact {
          position: absolute;
          right: 12px; top: 12px;
          display: flex; flex-direction: column; gap: 8px;
          z-index: 10;
        }
        .action-circle-btn-exact {
          width: 38px; height: 38px;
          background: white; border: none;
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #1a1a2e; font-size: 0.9rem;
          transition: all 0.2s; cursor: pointer;
        }
        .action-circle-btn-exact:hover { background: #0aad0a; color: white; }
        .btn-plus-exact {
          width: 50px; height: 50px;
          background-color: #0aad0a;
          color: white; border: none;
          font-size: 1.2rem;
          transition: transform 0.2s, background 0.2s;
        }
        .btn-plus-exact:hover { transform: scale(1.1); background-color: #088a08; }
      `}</style>
    </div>
  );
}
