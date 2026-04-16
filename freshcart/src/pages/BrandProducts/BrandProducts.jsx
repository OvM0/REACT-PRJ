import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';

const BASE = 'https://ecommerce.routemisr.com';

export default function BrandProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [brandRes, prodRes] = await Promise.all([
          axios.get(`${BASE}/api/v1/brands/${id}`),
          axios.get(`${BASE}/api/v1/products?brand=${id}&limit=20`),
        ]);
        setBrand(brandRes.data.data);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="py-5">
      <div className="container">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none small fw-bold">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/brands" className="text-success text-decoration-none small fw-bold">Brands</Link></li>
            <li className="breadcrumb-item active small" aria-current="page">{brand?.name}</li>
          </ol>
        </nav>

        {/* Brand Header */}
        {brand && (
          <div className="d-flex align-items-center gap-4 mb-5 p-4 rounded-4 shadow-sm bg-white border border-light">
            <div className="brand-logo-wrap p-2 rounded-3 bg-light d-flex align-items-center justify-content-center" style={{ width: '140px', height: '100px' }}>
              <img
                src={brand.image}
                alt={brand.name}
                className="img-fluid h-100"
                style={{ objectFit: 'contain' }}
                onError={e => { e.target.src = `https://via.placeholder.com/120x80?text=${brand.name}`; }}
              />
            </div>
            <div>
              <h1 className="fw-bold mb-1 display-6" style={{ color: '#1a1a2e' }}>{brand.name}</h1>
              <p className="text-success fw-bold mb-0">
                <i className="fas fa-check-circle me-1"></i>
                {products.length} Products available from this brand
              </p>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-4x text-muted mb-4 opacity-25"></i>
            <h4 className="text-muted fw-bold">No products found for this brand currently</h4>
            <Link to="/brands" className="btn btn-success rounded-pill mt-3 px-5 py-2 fw-bold">Browse All Brands</Link>
          </div>
        ) : (
          <div className="row g-4">
            {products.map(product => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .breadcrumb-item + .breadcrumb-item::before { content: "›"; color: #0aad0a; font-size: 1.2rem; line-height: 1; vertical-align: middle; }
        .bg-light { background-color: #f8fafc !important; }
      `}</style>
    </div>
  );
}
