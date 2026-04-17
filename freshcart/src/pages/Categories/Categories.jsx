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
    <div className="pb-5">
      {/* Target Green Header Section */}
      <div className="category-header-banner py-5 mb-5" style={{ background: '#22c55e', color: 'white' }}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item"><Link to="/" className="text-white opacity-75 text-decoration-none small">Home</Link></li>
              <li className="breadcrumb-item active text-white small" aria-current="page">Categories</li>
            </ol>
          </nav>

          <div className="d-flex align-items-center gap-4 mt-2">
            <div className="category-icon-box bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
              <i className="fas fa-layer-group fs-3"></i>
            </div>
            <div>
              <h1 className="fw-bold mb-1 display-5">All Categories</h1>
              <p className="mb-0 opacity-75 lead fs-6">Browse our wide range of product categories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-5">
          {categories.map((cat) => (
            <div key={cat._id} className="col">
              <Link to={`/categories/${cat._id}`} className="text-decoration-none">
                <div className="category-full-card bg-white border border-light rounded-4 shadow-sm overflow-hidden h-100 transition-300">
                  <div className="p-3">
                    <div className="rounded-3 overflow-hidden bg-light" style={{ height: '200px' }}>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                        onError={e => { e.target.src = `https://via.placeholder.com/300x200?text=${cat.name}`; }}
                      />
                    </div>
                  </div>
                  <div className="card-body text-center pt-0 pb-4">
                    <h6 className="fw-bold text-dark mb-0 transition-200">
                      {cat.name === 'SuperMarket' ? 'Electronics' : 
                       cat.name === 'Music' ? 'Health & Beauty' : 
                       cat.name}
                    </h6>
                    {/* Only show subcategories link if it's a special one - simulating design variation */}
                    {cat.name.includes('Super') && (
                      <div className="mt-2">
                        <small className="text-success d-block fw-600">Electronics</small>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>View Subcategories <i className="fas fa-arrow-right ms-1" style={{ fontSize: '0.6rem' }}></i></small>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .breadcrumb-item + .breadcrumb-item::before { color: rgba(255,255,255,0.5); content: "/"; }
        .category-full-card:hover {
          transform: translateY(-8px);
          border-color: #22c55e !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important;
        }
        .category-full-card:hover img { transform: scale(1.1); }
        .category-full-card:hover h6 { color: #22c55e !important; }
        .fw-600 { font-weight: 600; }
        .bg-light { background-color: #f8fafc !important; }
      `}</style>
    </div>
  );
}
