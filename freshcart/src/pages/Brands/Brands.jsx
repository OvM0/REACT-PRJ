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
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{ color: '#1a1a2e', fontSize: '2.2rem' }}>
            <i className="fas fa-award me-2 text-success"></i>الماركات العالمية
          </h1>
          <p className="text-muted mt-2">اكتشف أشهر الماركات العالمية في مكان واحد</p>
          <div style={{ width: '60px', height: '4px', background: '#0aad0a', borderRadius: '2px', margin: '16px auto 0' }}></div>
        </div>

        {/* Search */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="fas fa-search text-muted"></i></span>
              <input
                type="text"
                className="form-control shadow-none border-start-0"
                placeholder="ابحث عن ماركة..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">لا توجد ماركات مطابقة</h5>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(brand => (
              <div key={brand._id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <Link to={`/brands/${brand._id}`} className="text-decoration-none">
                  <div className="brand-card text-center">
                    <div className="brand-img-wrap">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        className="img-fluid"
                        style={{ maxHeight: '90px', objectFit: 'contain' }}
                        onError={e => { e.target.src = `https://via.placeholder.com/150x90?text=${brand.name}`; }}
                      />
                    </div>
                    <p className="fw-semibold mt-2 mb-0 text-dark" style={{ fontSize: '0.9rem' }}>
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
        .brand-card {
          background: #fff;
          border: 2px solid #f0f0f0;
          border-radius: 16px;
          padding: 20px 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .brand-card:hover {
          border-color: #0aad0a;
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(10,173,10,0.12);
        }
        .brand-img-wrap {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
