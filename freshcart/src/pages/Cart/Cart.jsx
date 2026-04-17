import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItem, clearCart } from '../../store/cartSlice';
import Loading from '../../components/Loading/Loading';
import toast from 'react-hot-toast';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, numOfCartItems, cartId, loading } = useSelector(state => state.cart);

  async function handleRemove(productId) {
    try {
      toast.success('Product removed successfully');
    } catch { toast.error('Error removing product'); }
  }

  async function handleUpdate(productId, count) {
    if (count < 1) { handleRemove(productId); return; }
    try {
      await dispatch(updateCartItem({ productId, count })).unwrap();
    } catch { toast.error('Error updating quantity'); }
  }

  async function handleClear() {
    if (!window.confirm('Do you want to clear your cart?')) return;
    try {
      await dispatch(clearCart()).unwrap();
      toast.success('Cart cleared successfully');
    } catch { toast.error('Error clearing cart'); }
  }

  if (loading) return <Loading />;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-5">
        <div className="container text-center py-5">
          <div className="empty-cart-icon mb-4">
            <i className="fas fa-cart-shopping fa-5x text-muted"></i>
          </div>
          <h2 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>Your cart is empty!</h2>
          <p className="text-muted mb-4">Add some products to your cart and start shopping</p>
          <Link to="/products" className="btn btn-success rounded-pill px-5 py-2 fw-bold">
            <i className="fas fa-store me-2"></i>Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>
              <i className="fas fa-cart-shopping me-2 text-success"></i>Shopping Cart
            </h1>
            <p className="text-muted mb-0">{numOfCartItems} products in your cart</p>
          </div>
          <button className="btn btn-outline-danger rounded-pill" onClick={handleClear}>
            <i className="fas fa-trash me-2"></i>Clear Cart
          </button>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div key={item._id} className="cart-item card border-0 shadow-sm mb-3">
                  <div className="card-body p-3">
                    <div className="row align-items-center g-3">
                      {/* Product Image */}
                      <div className="col-3 col-md-2">
                        <Link to={`/products/${item.product?._id}`}>
                          <img
                            src={item.product?.imageCover}
                            alt={item.product?.title}
                            className="img-fluid rounded-3"
                            style={{ maxHeight: '80px', objectFit: 'cover' }}
                            onError={e => { e.target.src = 'https://via.placeholder.com/80?text=N/A'; }}
                          />
                        </Link>
                      </div>

                      {/* Info */}
                      <div className="col-5 col-md-5">
                        <Link to={`/products/${item.product?._id}`} className="text-decoration-none">
                          <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                            {item.product?.title}
                          </h6>
                        </Link>
                        <p className="text-success fw-bold mb-0">
                          {item.price} EGP
                        </p>
                        <p className="text-muted small mb-0">{item.product?.category?.name}</p>
                      </div>

                      {/* Quantity */}
                      <div className="col-4 col-md-3">
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdate(item.product?._id, item.count - 1)}
                          >-</button>
                          <input
                            type="number"
                            className="form-control text-center shadow-none"
                            value={item.count}
                            readOnly
                            style={{ maxWidth: '50px' }}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdate(item.product?._id, item.count + 1)}
                          >+</button>
                        </div>
                      </div>

                      {/* Total + Remove */}
                      <div className="col-12 col-md-2 d-flex align-items-center justify-content-between justify-content-md-end">
                        <span className="fw-bold text-success d-md-none">
                          {(item.price * item.count).toLocaleString()} EGP
                        </span>
                        <button
                          className="btn btn-link text-danger p-1 ms-2"
                          onClick={() => handleRemove(item.product?._id)}
                          title="Remove"
                        >
                          <i className="fas fa-times-circle fs-5"></i>
                        </button>
                      </div>

                      {/* Item Total (Desktop) */}
                      <div className="col-md-2 d-none d-md-block text-end">
                        <span className="fw-bold text-success">
                          {(item.price * item.count).toLocaleString()} EGP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Items ({numOfCartItems})</span>
                  <span>{totalPrice?.toLocaleString()} EGP</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success fw-semibold">
                    {totalPrice >= 500 ? 'Free' : '50 EGP'}
                  </span>
                </div>
                {totalPrice < 500 && (
                  <div className="alert alert-info py-2 px-3" style={{ fontSize: '0.85rem' }}>
                    <i className="fas fa-info-circle me-1"></i>
                    Add {500 - totalPrice} EGP for free shipping
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5 text-success">
                    {(totalPrice + (totalPrice < 500 ? 50 : 0)).toLocaleString()} EGP
                  </span>
                </div>

                <button
                  className="btn btn-success w-100 rounded-pill py-3 fw-bold"
                  onClick={() => navigate(`/checkout/${cartId}`)}
                >
                  <i className="fas fa-lock me-2"></i>
                  Checkout
                </button>
                <Link to="/products" className="btn btn-outline-secondary w-100 rounded-pill py-2 mt-2">
                  <i className="fas fa-arrow-right me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-item { border-radius: 16px !important; transition: box-shadow 0.2s; }
        .cart-item:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}
