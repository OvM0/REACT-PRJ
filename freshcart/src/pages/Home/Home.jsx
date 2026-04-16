import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';
import './Home.css';

const BASE = 'https://ecommerce.routemisr.com';

const DEPARTMENTS = [
  { name: 'Dairy, Bread & Eggs', icon: 'fa-egg' },
  { name: 'Snack & Munchies', icon: 'fa-cookie' },
  { name: 'Fruits & Vegetables', icon: 'fa-apple-whole' },
  { name: 'Cold Drinks & Juices', icon: 'fa-glass-water' },
  { name: 'Breakfast & Instant Food', icon: 'fa-bowl-food' },
  { name: 'Bakery & Biscuits', icon: 'fa-bread-slice' },
  { name: 'Chicken, Meat & Fish', icon: 'fa-drumstick-bite' },
];

const HERO_SLIDES = [
  {
    title: 'Free Shipping on orders over $100',
    subtitle: 'Free Shipping on orders over $100',
    description: "Don't miss this opportunity to save more on your favorite products.",
    bg: '#f0f3f2',
    img: 'https://freshcart.codescandy.com/assets/images/slider/slider-image-1.jpg',
    badge: 'Free Shipping',
    btnLabel: 'Shop Now',
    btnTo: '/products',
  },
  {
    title: 'Get 25% Off on Fresh Fruits',
    subtitle: 'Limited Time Offer',
    description: 'Fresh from the farm to your doorstep. Stay healthy with our organic picks.',
    bg: '#fdf5e6',
    img: 'https://freshcart.codescandy.com/assets/images/slider/slider-image-2.jpg',
    badge: 'Flat 25% Off',
    btnLabel: 'Shop Now',
    btnTo: '/products',
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${BASE}/api/v1/products?limit=10`),
          axios.get(`${BASE}/api/v1/categories`),
        ]);
        setProducts(prodRes.data.data || []);
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="home-page">
      {/* Hero Section - Exact Design */}
      <section className="hero-full-width position-relative">
        <div className="hero-slider-wrap rounded-0 overflow-hidden">
          <div 
            className="hero-slide-main d-flex align-items-center" 
            style={{ 
              backgroundImage: 'url(https://freshcart.codescandy.com/assets/images/slider/slider-image-1.jpg)', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              minHeight: '480px'
            }}
          >
            <div className="container">
              <div className="hero-text-box" style={{ maxWidth: '600px', zIndex: 10 }}>
                <h1 className="display-3 fw-bold mb-3 text-white">
                  Fresh Products Delivered <br /> to your Door
                </h1>
                <p className="lead mb-4 fs-5 text-white opacity-90">
                  Get 20% off your first order
                </p>
                <div className="d-flex gap-3">
                  <Link to="/products" className="btn btn-light-custom btn-lg px-4 py-2 rounded-2 fw-bold" style={{ fontSize: '1rem' }}>
                    Shop Now
                  </Link>
                  <Link to="/products" className="btn btn-outline-light-custom btn-lg px-4 py-2 rounded-2 fw-bold" style={{ fontSize: '1rem' }}>
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Nav Arrows */}
            <button className="hero-nav-arrow start-arrow">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="hero-nav-arrow end-arrow">
              <i className="fas fa-chevron-right"></i>
            </button>

            {/* Dots */}
            <div className="hero-pagination-dots">
              <span className="h-dot active"></span>
              <span className="h-dot"></span>
              <span className="h-dot"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Matches Screenshot */}
      <section className="py-5 bg-light border-bottom">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-card-new p-4 text-start bg-white rounded-3 shadow-sm d-flex align-items-center gap-3">
                <div className="f-icon-wrap bg-primary-light text-primary">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Free Shipping</h6>
                  <p className="small text-muted mb-0">On orders over 500 EGP</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-card-new p-4 text-start bg-white rounded-3 shadow-sm d-flex align-items-center gap-3">
                <div className="f-icon-wrap bg-success-light text-success">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Secure Payment</h6>
                  <p className="small text-muted mb-0">100% secure transactions</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-card-new p-4 text-start bg-white rounded-3 shadow-sm d-flex align-items-center gap-3">
                <div className="f-icon-wrap bg-warning-light text-warning">
                  <i className="fas fa-arrow-rotate-left"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Easy Returns</h6>
                  <p className="small text-muted mb-0">14-day return policy</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-card-new p-4 text-start bg-white rounded-3 shadow-sm d-flex align-items-center gap-3">
                <div className="f-icon-wrap bg-purple-light text-purple">
                  <i className="fas fa-headset"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">24/7 Support</h6>
                  <p className="small text-muted mb-0">Dedicated support team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2">
          <div className="d-flex align-items-center gap-2">
            <div style={{ height: '30px', width: '5px', backgroundColor: '#0aad0a', borderRadius: '10px' }}></div>
            <h3 className="fw-bold mb-0">Shop By <span className="text-success">Category</span></h3>
          </div>
          <Link to="/categories" className="text-success text-decoration-none fw-bold" style={{ fontSize: '0.9rem' }}>
            View All Categories <i className="fas fa-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-3 g-md-4 categories-grid-new">
          {categories.slice(0, 10).map((cat) => (
            <div key={cat._id} className="col-4 col-md-3 col-lg-2">
              <Link to={`/products?category=${cat._id}`} className="text-decoration-none">
                <div className="category-card-circle p-3 p-md-4 text-center bg-white rounded-3 shadow-sm h-100">
                  <div className="cat-img-wrapper mb-3 mx-auto overflow-hidden rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/150?text=' + cat.name; }}
                    />
                  </div>
                  <h6 className="text-dark fw-bold mb-0 small text-truncate">{cat.name}</h6>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Promo Banners - Exact Design Match */}
        <div className="row g-4 mt-5">
          <div className="col-md-6">
            <div className="banner-promo-new p-5 rounded-4 d-flex flex-column h-100" style={{ background: 'linear-gradient(135deg, #0aad0a 0%, #088a08 100%)', color: 'white' }}>
              <div className="mb-auto">
                <span className="badge-glass mb-3 d-inline-block">
                  <i className="fas fa-fire me-1 text-warning"></i> Deal of the Day
                </span>
                <h2 className="fw-bold mb-2 display-6">Fresh Organic Fruits</h2>
                <p className="opacity-75 mb-4">Get up to 40% off on selected organic fruits</p>
                <div className="mb-4">
                  <span className="fs-3 fw-bold">40% OFF</span>
                  <span className="ms-3 opacity-75 small">Use code: <span className="fw-bold">ORGANIC40</span></span>
                </div>
              </div>
              <div>
                <Link to="/products" className="btn btn-pill-white">
                  Shop Now <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="banner-promo-new p-5 rounded-4 d-flex flex-column h-100" style={{ background: 'linear-gradient(135deg, #ff6b3d 0%, #ff4d4d 100%)', color: 'white' }}>
              <div className="mb-auto">
                <span className="badge-glass mb-3 d-inline-block">
                  <i className="fas fa-sparkles me-1 text-warning"></i> New Arrivals
                </span>
                <h2 className="fw-bold mb-2 display-6">Exotic Vegetables</h2>
                <p className="opacity-75 mb-4">Discover our latest collection of premium vegetables</p>
                <div className="mb-4">
                  <span className="fs-3 fw-bold">25% OFF</span>
                  <span className="ms-3 opacity-75 small">Use code: <span className="fw-bold">FRESH25</span></span>
                </div>
              </div>
              <div>
                <Link to="/products" className="btn btn-pill-white" style={{ color: '#ff6b3d' }}>
                  Explore Now <i className="fas fa-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products - Re-inserted Section */}
        <div className="mt-5 pt-4">
          <div className="d-flex align-items-center gap-2 mb-4 pb-1">
            <div style={{ height: '30px', width: '5px', backgroundColor: '#0aad0a', borderRadius: '10px' }}></div>
            <h3 className="fw-bold mb-0">Featured <span className="text-success">Products</span></h3>
          </div>
          <div className="row g-4">
            {products.slice(0, 10).map(product => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3 col-xl-2.4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter & Mobile App Section - High-Fidelity Match */}
        <div className="mt-5 pt-5 mb-5">
          <div className="newsletter-app-card p-4 p-md-5 rounded-5" style={{ background: '#f0fdf4' }}>
            <div className="row g-4 align-items-center">
              {/* Newsletter Left Side */}
              <div className="col-lg-7 border-end-lg pe-lg-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-success text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-envelope-open-text fs-5"></i>
                  </div>
                  <div>
                    <span className="text-success fw-bold small text-uppercase ls-wide">Newsletter</span>
                    <p className="small text-muted mb-0">50,000+ subscribers</p>
                  </div>
                </div>
                
                <h1 className="fw-bold mb-3 display-6">Get the Freshest Updates <span className="text-success">Delivered Free</span></h1>
                <p className="text-muted mb-4 lead fs-6">Weekly recipes, seasonal offers & exclusive member perks.</p>
                
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge-tag-custom"><i className="fas fa-leaf me-1"></i> Fresh Picks Weekly</span>
                  <span className="badge-tag-custom"><i className="fas fa-truck me-1"></i> Free Delivery Codes</span>
                  <span className="badge-tag-custom"><i className="fas fa-tag me-1"></i> Members-Only Deals</span>
                </div>

                <form className="newsletter-form shadow-sm rounded-pill overflow-hidden bg-white p-1 d-flex">
                  <input type="email" className="form-control border-0 px-4" placeholder="you@example.com" style={{ outline: 'none', boxShadow: 'none' }} />
                  <button type="submit" className="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center gap-2 m-1">
                    Subscribe <i className="fas fa-arrow-right"></i>
                  </button>
                </form>
                <p className="small text-muted mt-3 mb-0">✨ Unsubscribe anytime. No spam. ever.</p>
              </div>

              {/* Mobile App Right Side */}
              <div className="col-lg-5 ps-lg-5">
                <div className="mobile-app-promo-card p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)', color: 'white' }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 rounded-pill px-2 py-1 small" style={{ fontSize: '0.65rem' }}>
                      <i className="fas fa-mobile-alt me-1"></i> MOBILE APP
                    </span>
                  </div>
                  
                  <h3 className="fw-bold mb-2">Shop Faster on Our App</h3>
                  <p className="small opacity-75 mb-4">Get app-exclusive deals & 15% off your first order.</p>
                  
                  <div className="d-flex flex-column gap-3">
                    <button className="btn btn-app-store d-flex align-items-center gap-3 text-start">
                      <i className="fab fa-apple fs-2"></i>
                      <div>
                        <span className="small d-block ls-wide opacity-50 text-uppercase">Download on</span>
                        <span className="fw-bold">App Store</span>
                      </div>
                    </button>
                    <button className="btn btn-app-store d-flex align-items-center gap-3 text-start">
                      <i className="fab fa-google-play fs-4"></i>
                      <div>
                        <span className="small d-block ls-wide opacity-50 text-uppercase">Get it on</span>
                        <span className="fw-bold">Google Play</span>
                      </div>
                    </button>
                  </div>

                  <div className="mt-4 pt-2 d-flex align-items-center gap-2">
                    <div className="text-warning small d-flex gap-1">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="small opacity-75">4.9 • 100K+ downloads</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Services Footer Highlights - Exact Proximity */}
        <div className="pt-4 pb-1">
          <div className="row g-3 justify-content-center">
            <div className="col-12 col-md-3">
              <div className="service-footer-card d-flex align-items-center gap-3">
                <div className="icon-bubble-new">
                  <i className="fas fa-truck-fast"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.85rem' }}>Free Shipping</h6>
                  <p className="small text-muted mb-0" style={{ fontSize: '0.65rem' }}>On orders over 500 EGP</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="service-footer-card d-flex align-items-center gap-3">
                <div className="icon-bubble-new">
                  <i className="fas fa-arrow-rotate-left"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.85rem' }}>Easy Returns</h6>
                  <p className="small text-muted mb-0" style={{ fontSize: '0.65rem' }}>14-day return policy</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="service-footer-card d-flex align-items-center gap-3">
                <div className="icon-bubble-new">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.85rem' }}>Secure Payment</h6>
                  <p className="small text-muted mb-0" style={{ fontSize: '0.65rem' }}>100% secure checkout</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="service-footer-card d-flex align-items-center gap-3">
                <div className="icon-bubble-new">
                  <i className="fas fa-headset"></i>
                </div>
                <div className="text-start">
                  <h6 className="fw-bold mb-0" style={{ fontSize: '0.85rem' }}>24/7 Support</h6>
                  <p className="small text-muted mb-0" style={{ fontSize: '0.65rem' }}>Contact us anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
