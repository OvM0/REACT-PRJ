import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a2e', color: '#adb5bd', marginTop: '60px' }}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <h3 style={{ color: '#0aad0a', fontWeight: 800, fontSize: '1.6rem' }}>
              Fresh<span style={{ color: '#fff' }}>Cart</span>
            </h3>
            <p className="mt-3" style={{ lineHeight: '1.8' }}>
              منصة تسوق إلكتروني رائدة توفر لك أفضل المنتجات بأسعار منافسة مع خدمة توصيل سريعة وآمنة.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['facebook-f', 'twitter', 'instagram', 'youtube'].map(icon => (
                <a key={icon} href="#" className="social-icon">
                  <i className={`fab fa-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-6">
            <h6 className="fw-bold text-white mb-3">روابط سريعة</h6>
            <ul className="list-unstyled">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/products', label: 'المنتجات' },
                { to: '/categories', label: 'الفئات' },
                { to: '/brands', label: 'الماركات' },
                { to: '/cart', label: 'السلة' },
                { to: '/wishlist', label: 'المفضلة' },
              ].map(link => (
                <li key={link.to} className="mb-2">
                  <Link to={link.to} style={{ color: '#adb5bd', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#0aad0a'}
                    onMouseLeave={e => e.target.style.color = '#adb5bd'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-6">
            <h6 className="fw-bold text-white mb-3">تواصل معنا</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2" style={{ color: '#0aad0a' }}></i>
                القاهرة، مصر
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2" style={{ color: '#0aad0a' }}></i>
                +20 100 000 0000
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2" style={{ color: '#0aad0a' }}></i>
                support@freshcart.com
              </li>
              <li className="mb-2">
                <i className="fas fa-clock me-2" style={{ color: '#0aad0a' }}></i>
                24/7 دعم متواصل
              </li>
            </ul>
          </div>

          <div className="col-lg-3">
            <h6 className="fw-bold text-white mb-3">ادفع بأمان مع</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {['visa', 'cc-mastercard', 'cc-paypal', 'cc-amex'].map(card => (
                <i key={card} className={`fab fa-${card} fa-2x`} style={{ color: '#adb5bd' }}></i>
              ))}
            </div>
            <h6 className="fw-bold text-white mb-3 mt-3">حمّل التطبيق</h6>
            <div className="d-flex gap-2">
              <a href="#" className="store-badge">
                <i className="fab fa-apple me-1"></i> App Store
              </a>
              <a href="#" className="store-badge">
                <i className="fab fa-google-play me-1"></i> Play Store
              </a>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: '#2d3436', margin: '30px 0' }} />
        <div className="text-center" style={{ color: '#636e72', fontSize: '0.9rem' }}>
          <p className="mb-0">© 2024 FreshCart. جميع الحقوق محفوظة. صُنع بـ <span style={{ color: '#e74c3c' }}>❤</span> في مصر</p>
        </div>
      </div>

      <style>{`
        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
          text-decoration: none;
          transition: all 0.3s;
        }
        .social-icon:hover {
          background: #0aad0a;
          color: white;
          transform: translateY(-3px);
        }
        .store-badge {
          background: rgba(255,255,255,0.1);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.8rem;
          transition: background 0.2s;
        }
        .store-badge:hover {
          background: #0aad0a;
          color: white;
        }
      `}</style>
    </footer>
  );
}
