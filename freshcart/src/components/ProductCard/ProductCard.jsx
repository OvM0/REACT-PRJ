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
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    setAddingCart(true);
    try {
      await dispatch(addToCart(product._id)).unwrap();
      toast.success('تمت الإضافة إلى السلة ✓');
    } catch (err) {
      toast.error(err || 'حدث خطأ');
    } finally {
      setAddingCart(false);
    }
  }

  async function handleWishlist(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }
    setAddingWish(true);
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('تمت الإزالة من المفضلة');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('تمت الإضافة إلى المفضلة ❤');
      }
    } catch (err) {
      toast.error(err || 'حدث خطأ');
    } finally {
      setAddingWish(false);
    }
  }

  const discount = product.priceAfterDiscount
    ? Math.round((1 - product.priceAfterDiscount / product.price) * 100)
    : null;

  return (
    <div className="product-card card border-0 shadow-sm h-100 position-relative overflow-hidden">
      {/* Wishlist Button */}
      <button
        className="wishlist-btn position-absolute"
        onClick={handleWishlist}
        disabled={addingWish}
        title={isWishlisted ? 'إزالة من المفضلة' : 'أضف للمفضلة'}
      >
        <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`}
          style={{ color: isWishlisted ? '#e74c3c' : '#adb5bd' }}></i>
      </button>

      {/* Discount Badge */}
      {discount && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2 rounded-pill">
          -{discount}%
        </span>
      )}

      <Link to={`/products/${product._id}`} className="text-decoration-none">
        <div className="product-img-wrap">
          <img
            src={product.imageCover}
            alt={product.title}
            className="card-img-top"
            style={{ objectFit: 'cover', height: '220px', transition: 'transform 0.4s' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'; }}
          />
        </div>

        <div className="card-body p-3">
          <p className="text-success small fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>
            {product.category?.name}
          </p>
          <h6 className="card-title text-truncate fw-bold mb-1" style={{ color: '#2d3436' }}>
            {product.title}
          </h6>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="fw-bold text-success">
                {product.priceAfterDiscount || product.price} جنيه
              </span>
              {product.priceAfterDiscount && (
                <span className="text-muted text-decoration-line-through ms-2 small">
                  {product.price} جنيه
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-1">
              <i className="fa-solid fa-star" style={{ color: '#f39c12', fontSize: '0.8rem' }}></i>
              <span style={{ fontSize: '0.85rem', color: '#636e72' }}>
                {product.ratingsAverage?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="card-footer bg-transparent border-0 p-3 pt-0">
        <button
          className="btn btn-success w-100 rounded-pill btn-sm fw-semibold"
          onClick={handleAddToCart}
          disabled={addingCart}
        >
          {addingCart ? (
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          ) : (
            <i className="fas fa-cart-plus me-2"></i>
          )}
          {addingCart ? 'جاري الإضافة...' : 'أضف للسلة'}
        </button>
      </div>

      <style>{`
        .product-card { border-radius: 16px !important; transition: all 0.3s; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.12) !important; }
        .product-card:hover .card-img-top { transform: scale(1.05); }
        .product-img-wrap { overflow: hidden; }
        .wishlist-btn {
          top: 10px; right: 10px;
          background: white;
          border: none;
          border-radius: 50%;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          z-index: 1;
          transition: transform 0.2s;
        }
        .wishlist-btn:hover { transform: scale(1.15); }
      `}</style>
    </div>
  );
}
