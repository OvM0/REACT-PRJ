import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#09101d', color: '#9ca3af', paddingTop: '60px' }}>
      <div className="container">
        <div className="row g-4 pb-5">
          {/* Brand & Contact Column */}
          <div className="col-lg-3 pe-lg-5">
            <div className="bg-white p-2 rounded-2 mb-4 d-inline-block">
              <h3 style={{ color: '#0aad0a', fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>
                Fresh<span style={{ color: '#111827' }}>Cart</span>
              </h3>
            </div>
            <p className="small mb-4" style={{ lineHeight: '1.7', color: '#9ca3af' }}>
              FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
            </p>
            
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-phone text-success small"></i>
                <span className="small">+1 (800) 123-4567</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-envelope text-success small"></i>
                <span className="small">support@freshcart.com</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="fas fa-map-marker-alt text-success small"></i>
                <span className="small">123 Commerce Street, New York, NY 10001</span>
              </div>
            </div>

            <div className="d-flex gap-2">
              {['facebook-f', 'twitter', 'instagram', 'youtube'].map(icon => (
                <a key={icon} href="#" className="social-icon-footer">
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold text-white mb-4">Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              {['All Products', 'Categories', 'Brands', 'Electronics', "Men's Fashion", "Women's Fashion"].map(label => (
                <li key={label}><Link to="/products" className="footer-link-new">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account Column */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold text-white mb-4">Account</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              <li><Link to="/allorders" className="footer-link-new">Order History</Link></li>
              <li><Link to="/wishlist" className="footer-link-new">Wishlist</Link></li>
              <li><Link to="/cart" className="footer-link-new">Shopping Cart</Link></li>
              <li><Link to="/login" className="footer-link-new">Sign In</Link></li>
              <li><Link to="/register" className="footer-link-new">Create Account</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold text-white mb-4">Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              {['Contact Us', 'Help Center', 'Shipping Info', 'Returns & Refunds', 'Track Order'].map(label => (
                <li key={label}><Link to="#" className="footer-link-new">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-lg-2 col-6">
            <h6 className="fw-bold text-white mb-4">Legal</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
                <li key={label}><Link to="#" className="footer-link-new">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top border-secondary py-4 mt-2">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <p className="small mb-0 text-secondary">© 2026 FreshCart. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex align-items-center justify-content-md-end gap-3 text-secondary">
                <i className="fab fa-cc-visa fa-lg"></i>
                <i className="fab fa-cc-mastercard fa-lg"></i>
                <i className="fab fa-cc-paypal fa-lg"></i>
                <span className="small ms-2">Visa</span>
                <span className="small">Mastercard</span>
                <span className="small">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link-new {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        .footer-link-new:hover {
          color: #0aad0a;
        }
        .social-icon-footer {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.8rem;
          transition: all 0.3s;
        }
        .social-icon-footer:hover {
          background: #0aad0a;
          color: white;
          transform: translateY(-2px);
        }
        .ls-wide { letter-spacing: 0.5px; }
      `}</style>
    </footer>
  );
}
