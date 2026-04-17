import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import ProductCard from '../../components/ProductCard/ProductCard';

const BASE = 'https://ecommerce.routemisr.com';

export default function CategoryProducts() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${BASE}/api/v1/categories/${id}`),
          axios.get(`${BASE}/api/v1/products?category=${id}`),
        ]);
        setCategory(catRes.data.data);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="category-products-page bg-white min-vh-100">
      {/* ── Green Banner Header ── */}
      <div className="category-banner py-5 mb-5" style={{ background: '#0aad0a' }}>
        <div className="container py-3">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb mb-0 align-items-center">
              <li className="breadcrumb-item"><Link to="/" className="text-white opacity-75 text-decoration-none small">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/categories" className="text-white opacity-75 text-decoration-none small">Categories</Link></li>
              <li className="breadcrumb-item active text-white small fw-bold" aria-current="page">{category?.name}</li>
            </ol>
          </nav>

          <div className="d-flex align-items-center gap-4">
            <div className="bg-white rounded-4 p-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
              <img src={category?.image} alt={category?.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="text-white">
              <h1 className="fw-bold mb-1 display-5">{category?.name}</h1>
              <p className="mb-0 opacity-75 fs-5">Browse products in {category?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* ── Active Filters Bar ── */}
        <div className="active-filters-bar d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small fw-bold text-uppercase ls-wide"><i className="fas fa-filter me-2"></i>Active Filters:</span>
            <div className="filter-tag bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-1 rounded-pill small d-flex align-items-center gap-2">
              <i className="fas fa-grid-2 small"></i> {category?.name}
              <Link to="/products" className="text-success text-decoration-none ms-1"><i className="fas fa-times"></i></Link>
            </div>
            <Link to="/products" className="text-muted small text-decoration-none ms-2">Clear all</Link>
          </div>
          <div className="text-muted small fw-semibold">
            Showing <span className="text-dark fw-bold">{products.length}</span> products
          </div>
        </div>

        {/* ── Products Grid ── */}
        {products.length > 0 ? (
          <div className="row g-4 mb-5">
            {products.map((p) => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 my-5">
            <div className="mb-4">
              <i className="fas fa-box-open display-1 text-light"></i>
            </div>
            <h3 className="fw-bold text-dark">No products found</h3>
            <p className="text-muted">We couldn't find any products in this category at the moment.</p>
            <Link to="/products" className="btn btn-success rounded-pill px-4 py-2 mt-3">Explore All Products</Link>
          </div>
        )}
      </div>

      <style>{`
        .category-banner {
          position: relative;
          overflow: hidden;
        }
        .category-banner::after {
          content: "";
          position: absolute;
          right: -50px;
          top: -50px;
          width: 300px;
          height: 300px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }
        .breadcrumb-item + .breadcrumb-item::before {
          content: "/";
          color: rgba(255,255,255,0.5);
          padding: 0 10px;
        }
        .ls-wide { letter-spacing: 0.05em; }
        .filter-tag { transition: all 0.2s; }
        .filter-tag:hover { background: rgba(10, 173, 10, 0.15) !important; }
      `}</style>
    </div>
  );
}
