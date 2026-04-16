import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { resetCart } from '../../store/cartSlice';
import { resetWishlist } from '../../store/wishlistSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Navbar.css';

const BASE = 'https://ecommerce.routemisr.com';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { numOfCartItems } = useSelector(state => state.cart);
  const { wishlistIds } = useSelector(state => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${BASE}/api/v1/categories`)
      .then(res => setCategories(res.data.data || []))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  function handleLogout() {
    dispatch(logout());
    dispatch(resetCart());
    dispatch(resetWishlist());
    toast.success('Signed out successfully');
    navigate('/login');
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${searchVal.trim()}`);
      setSearchVal('');
    }
  }

  return (
    <div className="freshcart-header fixed-top">
      {/* ── Top Bar ── */}
      <div className="top-bar py-2 border-bottom bg-white d-none d-lg-block">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-auto d-flex align-items-center gap-4">
              <div className="small text-muted d-flex align-items-center gap-2">
                <i className="fas fa-truck text-success"></i>
                <span>Free Shipping on Orders 500 EGP</span>
              </div>
              <div className="small text-muted d-flex align-items-center gap-2">
                <i className="fas fa-gift text-success"></i>
                <span>New Arrivals Daily</span>
              </div>
            </div>
            <div className="col d-flex justify-content-end align-items-center gap-4">
              <div className="small text-muted d-flex align-items-center gap-2">
                <i className="fas fa-phone-alt small"></i>
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="small text-muted d-flex align-items-center gap-2 pe-3 border-end">
                <i className="fas fa-envelope small"></i>
                <span>support@freshcart.com</span>
              </div>
              {!isAuthenticated ? (
                <div className="d-flex align-items-center gap-3 ps-1">
                  <Link to="/login" className="small text-dark text-decoration-none fw-semibold">
                    <i className="fas fa-user small me-1"></i> Sign In
                  </Link>
                  <Link to="/register" className="small text-dark text-decoration-none fw-semibold">
                    <i className="fas fa-user-plus small me-1"></i> Sign Up
                  </Link>
                </div>
              ) : (
                <div className="ps-1">
                  <span className="small text-success fw-bold">Welcome, {user?.name?.split(' ')[0]}!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm border-bottom">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img 
              src="https://freshcart.codescandy.com/assets/images/logo/freshcart-logo.svg" 
              alt="FreshCart" 
              style={{ height: '30px' }} 
            />
          </Link>

          {/* Mobile Toggler */}
          <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
            <i className="fas fa-bars text-success"></i>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            {/* Search Bar */}
            <form className="mx-lg-auto search-wrapper mt-3 mt-lg-0 position-relative" style={{ minWidth: '35%', maxWidth: '40%' }} onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control rounded-pill border-light bg-light py-2 ps-4 pe-5 small"
                placeholder="Search for products, brands and more..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                style={{ height: '44px', border: '1px solid #eee' }}
              />
              <button type="submit" className="btn btn-success rounded-circle position-absolute end-0 top-50 translate-middle-y me-1 p-0 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#0aad0a', border: 'none' }}>
                <i className="fas fa-search x-small"></i>
              </button>
            </form>

            {/* Nav Links */}
            <ul className="navbar-nav align-items-center gap-lg-3 mx-lg-3 mt-3 mt-lg-0">
              <li className="nav-item"><NavLink className="nav-link fw-semibold px-2" to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link fw-semibold px-2" to="/products">Shop</NavLink></li>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle fw-semibold px-2" role="button" data-bs-toggle="dropdown">
                  Categories
                </span>
                <ul className="dropdown-menu border-0 shadow-lg rounded-4 p-2">
                  {categories.map(cat => (
                    <li key={cat._id}><Link className="dropdown-item rounded-3 small" to={`/categories/${cat._id}`}>{cat.name}</Link></li>
                  ))}
                </ul>
              </li>
              <li className="nav-item"><NavLink className="nav-link fw-semibold px-2" to="/brands">Brands</NavLink></li>
            </ul>

            {/* Support & Actions Area */}
            <div className="d-flex align-items-center gap-3 ms-auto mt-3 mt-lg-0">
              {/* Support Module */}
              <div className="d-none d-xl-flex align-items-center gap-2 pe-3 border-end">
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="fas fa-headset fs-5"></i>
                </div>
                <div className="lh-1">
                  <div className="small text-muted x-small fw-semibold">Support</div>
                  <div className="small fw-bold">24/7 Help</div>
                </div>
              </div>

              {/* Action Icons */}
              <div className="d-flex align-items-center gap-3">
                <Link to="/wishlist" className="nav-icon position-relative text-dark">
                  <i className="fa-regular fa-heart fs-5"></i>
                  {wishlistIds.length > 0 && <span className="badge-fresh">{wishlistIds.length}</span>}
                </Link>
                <Link to="/cart" className="nav-icon position-relative text-dark">
                  <i className="fa-solid fa-cart-shopping fs-5"></i>
                  {numOfCartItems > 0 && <span className="badge-fresh">{numOfCartItems}</span>}
                </Link>
                
                {isAuthenticated ? (
                  <button className="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center gap-2 small fw-bold" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center gap-2 small fw-bold" style={{ backgroundColor: '#0aad0a', border: 'none' }}>
                    <i className="fas fa-user small"></i> Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div style={{ height: '0px' }} className="d-block d-lg-none mt-5"></div>
    </div>
  );
}

