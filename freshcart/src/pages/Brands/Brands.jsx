import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';

const BASE = 'https://ecommerce.routemisr.com';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${BASE}/api/v1/brands?limit=100`)
      .then(r => setBrands(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    : brands;

  if (loading) return <Loading />;

  return (
    <div className="py-5">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-2" style={{ color: '#1a1a2e', fontSize: '2.5rem' }}>
            <i className="fas fa-award me-2 text-success"></i>Global Brands
          </h1>
          <p className="text-muted">Discover the world's most trusted brands all in one place</p>
          <div style={{ width: '60px', height: '4px', background: '#0aad0a', borderRadius: '10px', margin: '1.5rem auto 0' }}></div>
        </div>

        {/* Search Bar */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-6 col-lg-5">
            <div className="input-group shadow-sm rounded-pill overflow-hidden border">
              <span className="input-group-text bg-white border-0 ps-4">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none py-3"
                placeholder="Search for a brand..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-magnifying-glass fa-4x text-muted mb-4 opacity-25"></i>
            <h5 className="text-muted fw-bold">No brands matching your search</h5>
            <button className="btn btn-link text-success text-decoration-none" onClick={() => setSearch('')}>Clear search</button>
          </div>
        ) : (
          <div className="row g-4 row-cols-2 row-cols-md-4 row-cols-lg-5 row-cols-xl-6">
            {filtered.map(brand => (
              <div key={brand._id} className="col">
                <Link to={`/brands/${brand._id}`} className="text-decoration-none">
                  <div className="brand-card h-100 d-flex flex-column align-items-center justify-content-center p-4 bg-white border border-light rounded-4 transition-300">
                    <div className="brand-img-wrap mb-3 w-100 d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="img-fluid"
                        style={{ maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                        onError={e => { e.target.src = `https://via.placeholder.com/150x80?text=${brand.name}`; }}
                      />
                    </div>
                    <p className="fw-bold mb-0 text-dark small text-center transition-200">
                      {brand.name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .brand-card { cursor: pointer; border-width: 2px !important; }
        .brand-card:hover {
          border-color: #0aad0a !important;
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(10,173,10,0.08) !important;
        }
        .brand-card:hover img { transform: scale(1.1); }
        .brand-card:hover p { color: #0aad0a !important; }
        .transition-300 { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .transition-200 { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
}
