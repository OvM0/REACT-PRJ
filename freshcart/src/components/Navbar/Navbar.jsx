import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { resetCart } from '../../store/cartSlice';
import { resetWishlist } from '../../store/wishlistSlice';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { numOfCartItems } = useSelector(state => state.cart);
  const { wishlistIds } = useSelector(state => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  function handleLogout() {
    dispatch(logout());
    dispatch(resetCart());
    dispatch(resetWishlist());
    toast.success('تم تسجيل الخروج بنجاح');
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
    <header className="freshcart-header sticky-top">
      {/* ── Top Bar ── */}
      <div className="top-bar d-none d-lg-block">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-4">
              <span><i className="fas fa-truck-fast me-1"></i> شحن مجاني على الطلبات فوق 500 جنيه</span>
              <span><i className="fas fa-tags me-1"></i> منتجات جديدة يومياً</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <a href="tel:+18001234567" className="top-link">
                <i className="fas fa-phone me-1"></i> +1 (800) 123-4567
              </a>
              <a href="mailto:support@freshcart.com" className="top-link">
                <i className="fas fa-envelope me-1"></i> support@freshcart.com
              </a>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="top-link fw-semibold">تسجيل دخول</Link>
                  <span className="text-white-50">|</span>
                  <Link to="/register" className="top-link fw-semibold">إنشاء حساب</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav className="navbar navbar-expand-lg main-navbar">
        <div className="container gap-3">
          {/* Logo */}
          <Link className="navbar-brand flex-shrink-0" to="/">
            <span className="logo-fresh">Fresh</span><span className="logo-cart">Cart</span>
          </Link>

          {/* Search Bar (desktop) */}
          <form className="search-form flex-grow-1 d-none d-lg-flex" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control search-input shadow-none"
              placeholder="ابحث عن منتجات، ماركات وأكثر..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0 ms-auto"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fa-solid ${menuOpen ? 'fa-times' : 'fa-bars'} text-dark fs-5`}></i>
          </button>

          {/* Right side */}
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            {/* Nav Links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end onClick={() => setMenuOpen(false)}>الرئيسية</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products" onClick={() => setMenuOpen(false)}>المنتجات</NavLink>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">الفئات</span>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/categories">كل الفئات</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/categories/6439d2d167d9aa4ca970649f">Electronics</Link></li>
                  <li><Link className="dropdown-item" to="/categories/6439d58a0049ad0b52b9003f">Women's Fashion</Link></li>
                  <li><Link className="dropdown-item" to="/categories/6439d5b90049ad0b52b90048">Men's Fashion</Link></li>
                  <li><Link className="dropdown-item" to="/categories/6439d40367d9aa4ca97064a8">Beauty & Health</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/brands" onClick={() => setMenuOpen(false)}>الماركات</NavLink>
              </li>
            </ul>

            {/* Icons + Auth */}
            <ul className="navbar-nav align-items-center gap-1">
              {/* Support */}
              <li className="nav-item d-none d-xl-flex align-items-center me-2">
                <div className="support-badge">
                  <i className="fas fa-headset text-success fs-5"></i>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#888', lineHeight: 1 }}>Support</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1 }}>24/7 Help</div>
                  </div>
                </div>
              </li>

              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="icon-btn position-relative" to="/wishlist" onClick={() => setMenuOpen(false)} title="المفضلة">
                      <i className="fa-regular fa-heart"></i>
                      {wishlistIds.length > 0 && <span className="icon-badge bg-danger">{wishlistIds.length}</span>}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="icon-btn position-relative" to="/cart" onClick={() => setMenuOpen(false)} title="السلة">
                      <i className="fas fa-cart-shopping"></i>
                      {numOfCartItems > 0 && <span className="icon-badge bg-success">{numOfCartItems}</span>}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-success btn-sm rounded-pill px-3 d-flex align-items-center gap-2" onClick={handleLogout}>
                      <i className="fas fa-user-circle"></i>
                      <span className="d-none d-xl-inline">{user?.name?.split(' ')[0] || 'حسابي'}</span>
                      <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem' }}></i>
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="btn btn-success btn-sm rounded-pill px-4" to="/login">
                    <i className="fas fa-user me-1"></i> Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
