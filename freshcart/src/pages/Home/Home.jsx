import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';
import './Home.css';

const BASE = 'https://ecommerce.routemisr.com';

const HERO_SLIDES = [
  {
    title: 'منتجات طازجة توصلها لبابك',
    subtitle: 'احصل على خصم 20% على أول طلب',
    bg: 'linear-gradient(135deg, #0aad0a 0%, #088a08 60%, #065e06 100%)',
    img: 'https://ecommerce.routemisr.com/Route-Academy-categories/1681511179514.png',
    badge: '⚡ خصم 20%',
    btnLabel: 'تسوق الآن',
    btnTo: '/products',
  },
  {
    title: 'أحدث الماركات العالمية',
    subtitle: 'اكتشف أحدث المنتجات بضمان الجودة',
    bg: 'linear-gradient(135deg, #2d3436 0%, #1a1a2e 100%)',
    img: 'https://ecommerce.routemisr.com/Route-Academy-categories/1681511121316.png',
    badge: '🌟 وصل حديثاً',
    btnLabel: 'تصفح الماركات',
    btnTo: '/brands',
  },
  {
    title: 'توصيل مجاني فوق 500 جنيه',
    subtitle: 'توصيل في نفس اليوم للقاهرة والجيزة',
    bg: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
    img: 'https://ecommerce.routemisr.com/Route-Academy-categories/1681511452254.png',
    badge: '🚀 توصيل سريع',
    btnLabel: 'اعرف أكثر',
    btnTo: '/products',
  },
];

const FEATURES = [
  { icon: 'fa-truck-fast', title: 'توصيل مجاني', desc: 'على الطلبات فوق 500 جنيه', color: '#0aad0a' },
  { icon: 'fa-shield-halved', title: 'دفع آمن', desc: 'حماية كاملة لبياناتك', color: '#3498db' },
  { icon: 'fa-arrow-rotate-left', title: 'إرجاع سهل', desc: 'خلال 14 يوم من الاستلام', color: '#e67e22' },
  { icon: 'fa-headset', title: 'دعم 24/7', desc: 'فريق دعم متواصل معك', color: '#9b59b6' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${BASE}/api/v1/products?limit=8`),
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

  const slide = HERO_SLIDES[heroSlide];

  if (loading) return <Loading />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ background: slide.bg }}>
        <div className="container">
          <div className="row align-items-center min-vh-hero g-4">
            <div className="col-lg-6 text-white">
              <span className="hero-badge">{slide.badge}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to={slide.btnTo} className="btn btn-white-custom btn-lg rounded-pill px-4">
                  <i className="fas fa-shopping-bag me-2"></i>{slide.btnLabel}
                </Link>
                <Link to="/categories" className="btn btn-outline-white btn-lg rounded-pill px-4">
                  الفئات
                </Link>
              </div>
              {/* Slide Indicators */}
              <div className="slide-dots mt-4">
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} className={`dot ${i === heroSlide ? 'active' : ''}`}
                    onClick={() => setHeroSlide(i)} />
                ))}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-img-wrap">
                <img src={slide.img} alt="hero" className="hero-img img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-4 bg-white shadow-sm">
        <div className="container">
          <div className="row g-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="feature-card text-center p-3">
                  <div className="feature-icon" style={{ background: f.color + '15', color: f.color }}>
                    <i className={`fas ${f.icon} fa-xl`}></i>
                  </div>
                  <h6 className="fw-bold mt-2 mb-1">{f.title}</h6>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">تسوق حسب الفئة</h2>
            <Link to="/categories" className="btn btn-outline-success rounded-pill px-4">
              عرض الكل <i className="fas fa-arrow-left ms-1"></i>
            </Link>
          </div>
          <div className="row g-3">
            {categories.slice(0, 6).map(cat => (
              <div key={cat._id} className="col-6 col-md-4 col-lg-2">
                <Link to={`/categories/${cat._id}`} className="text-decoration-none">
                  <div className="category-card text-center">
                    <div className="cat-img-wrap">
                      <img src={cat.image} alt={cat.name} />
                    </div>
                    <p className="fw-semibold mt-2 mb-0 text-dark small">{cat.name}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="py-4">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="promo-banner" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                <div>
                  <span className="badge bg-white text-purple mb-2">🔥 عرض اليوم</span>
                  <h4 className="text-white fw-bold">خصم 40% على الفاكهة الطازجة</h4>
                  <p className="text-white-50 mb-3">استخدم كود: FRESH40</p>
                  <Link to="/products" className="btn btn-white-promo">تسوق الآن</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="promo-banner" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                <div>
                  <span className="badge bg-white text-pink mb-2">✨ وصل حديثاً</span>
                  <h4 className="text-white fw-bold">خضروات فريدة من المزرعة</h4>
                  <p className="text-white-50 mb-3">خصم 25% - كود: VEGGIE25</p>
                  <Link to="/products" className="btn btn-white-promo">استكشف الآن</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">منتجات مميزة</h2>
            <Link to="/products" className="btn btn-outline-success rounded-pill px-4">
              عرض الكل <i className="fas fa-arrow-left ms-1"></i>
            </Link>
          </div>
          <div className="row g-3">
            {products.map(product => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter + Mobile App Section */}
      <section className="py-5 newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="row g-0 align-items-stretch">
              {/* Newsletter */}
              <div className="col-lg-7 newsletter-left p-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="newsletter-icon">
                    <i className="fas fa-envelope-open-text text-success fs-4"></i>
                  </div>
                  <div>
                    <div className="text-success fw-bold small text-uppercase">NEWSLETTER</div>
                    <div className="text-muted small">50,000+ subscribers</div>
                  </div>
                </div>
                <h3 className="fw-bold mb-2" style={{ color: '#1a1a2e', fontSize: '1.7rem' }}>
                  Get the Freshest Updates <span className="text-success">Delivered Free</span>
                </h3>
                <p className="text-muted mb-4">Weekly recipes, seasonal offers &amp; exclusive member perks.</p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {['Fresh Picks Weekly', 'Free Delivery Codes', 'Members-Only Deals'].map(tag => (
                    <span key={tag} className="newsletter-tag">
                      <i className="fas fa-check-circle text-success me-1"></i>{tag}
                    </span>
                  ))}
                </div>
                <form className="newsletter-form" onSubmit={e => { e.preventDefault(); alert('Subscribed!'); }}>
                  <input type="email" className="form-control newsletter-input shadow-none" placeholder="you@example.com" required />
                  <button type="submit" className="btn btn-success newsletter-btn rounded-pill px-4 fw-bold">
                    Subscribe <i className="fas fa-arrow-left ms-2"></i>
                  </button>
                </form>
                <p className="text-muted mt-2" style={{ fontSize: '0.78rem' }}>
                  <i className="fas fa-shield-halved text-success me-1"></i>
                  Unsubscribe anytime. No spam, ever.
                </p>
              </div>

              {/* Mobile App */}
              <div className="col-lg-5 app-right p-5 d-flex flex-column justify-content-center">
                <div className="app-badge-top mb-3">
                  <i className="fas fa-mobile-screen me-2"></i>MOBILE APP
                </div>
                <h4 className="fw-bold text-white mb-2">Shop Faster on Our App</h4>
                <p className="mb-4" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
                  Get app-exclusive deals &amp; 15% off your first order.
                </p>
                <div className="d-flex flex-column gap-3">
                  <a href="#" className="store-btn-app">
                    <i className="fab fa-apple fs-3 me-3"></i>
                    <div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>DOWNLOAD ON</div>
                      <div className="fw-bold">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="store-btn-app">
                    <i className="fab fa-google-play fs-3 me-3"></i>
                    <div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>GET IT ON</div>
                      <div className="fw-bold">Google Play</div>
                    </div>
                  </a>
                </div>
                <div className="mt-4 d-flex align-items-center gap-2">
                  <div className="d-flex">
                    {[1,2,3,4,5].map(s => <i key={s} className="fas fa-star" style={{ color: '#f39c12', fontSize: '0.85rem' }}></i>)}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>4.9 · 100K+ downloads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
