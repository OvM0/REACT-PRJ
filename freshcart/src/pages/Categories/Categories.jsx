import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';

const BASE = 'https://ecommerce.routemisr.com';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BASE}/api/v1/categories`)
      .then(r => setCategories(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ color: '#1a1a2e', fontSize: '2.2rem' }}>
            <i className="fas fa-th-large me-2 text-success"></i>جميع الفئات
          </h1>
          <p className="text-muted mt-2">تصفح منتجاتنا حسب الفئة واعثر على ما تبحث عنه بسهولة</p>
          <div style={{ width: '60px', height: '4px', background: '#0aad0a', borderRadius: '2px', margin: '0 auto' }}></div>
        </div>

        <div className="row g-4">
          {categories.map((cat, i) => (
            <div key={cat._id} className="col-6 col-md-4 col-lg-3">
              <Link to={`/categories/${cat._id}`} className="text-decoration-none">
                <div className="cat-big-card position-relative overflow-hidden rounded-4 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-100"
                    style={{ height: '200px', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onError={e => { e.target.src = `https://via.placeholder.com/300x200?text=${cat.name}`; }}
                  />
                  <div className="cat-overlay">
                    <div className="cat-overlay-content">
                      <h5 className="text-white fw-bold mb-1">{cat.name}</h5>
                      <span className="btn btn-sm btn-white-cat rounded-pill">
                        تسوق الآن <i className="fas fa-arrow-left ms-1"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cat-big-card { cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
        .cat-big-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
        .cat-big-card:hover img { transform: scale(1.1); }
        .cat-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%);
          display: flex; align-items: flex-end; padding: 20px;
          transition: background 0.3s;
        }
        .cat-big-card:hover .cat-overlay {
          background: linear-gradient(to top, rgba(10,173,10,0.8) 0%, rgba(0,0,0,0.3) 100%);
        }
        .cat-overlay-content { width: 100%; }
        .btn-white-cat {
          background: rgba(255,255,255,0.25);
          color: white;
          border: 1px solid rgba(255,255,255,0.5);
          font-size: 0.8rem;
          backdrop-filter: blur(4px);
        }
        .cat-big-card:hover .btn-white-cat { background: white; color: #0aad0a; }
      `}</style>
    </div>
  );
}
