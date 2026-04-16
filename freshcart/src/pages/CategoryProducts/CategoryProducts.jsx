import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';

const BASE = 'https://ecommerce.routemisr.com';

export default function CategoryProducts() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, subRes, prodRes] = await Promise.all([
          axios.get(`${BASE}/api/v1/categories/${id}`),
          axios.get(`${BASE}/api/v1/categories/${id}/subcategories`),
          axios.get(`${BASE}/api/v1/products?category=${id}&limit=20`),
        ]);
        setCategory(catRes.data.data);
        setSubcategories(subRes.data.data || []);
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
    <div className="pb-5">
      {/* Target Green Header Banner */}
      <div className="category-header-banner py-5 mb-5" style={{ background: '#22c55e', color: 'white' }}>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item"><Link to="/" className="text-white opacity-75 text-decoration-none small">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/categories" className="text-white opacity-75 text-decoration-none small">Categories</Link></li>
              <li className="breadcrumb-item active text-white small" aria-current="page">{category?.name}</li>
            </ol>
          </nav>

          <div className="d-flex align-items-center gap-4 mt-2">
            <div className="category-icon-box bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center p-2" style={{ width: '60px', height: '60px' }}>
              <img src={category?.image} alt="" className="img-fluid rounded-2 h-100" style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <h1 className="fw-bold mb-1 display-5">{category?.name}</h1>
              <p className="mb-0 opacity-75 lead fs-6">Choose a subcategory to browse products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Back Link */}
        <div className="mb-4">
          <Link to="/categories" className="text-decoration-none text-muted small d-flex align-items-center gap-2">
            <i className="fas fa-arrow-left"></i> Back to Categories
          </Link>
        </div>

        {/* Subcategories Grid */}
        <div className="mb-5">
          <h5 className="fw-bold mb-4">{subcategories.length} Subcategories in {category?.name}</h5>
          <div className="row g-4">
            {subcategories.map(sub => (
              <div key={sub._id} className="col-12 col-md-4 col-lg-3">
                <div className="subcategory-card bg-white border border-light rounded-4 shadow-sm p-4 h-100 transition-300">
                  <div className="icon-folder-box bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center mb-3" style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-folder-open fs-5"></i>
                  </div>
                  <h6 className="fw-bold mb-0">{sub.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section (Optional Add-on for completeness) */}
        {products.length > 0 && (
          <div className="mt-5 pt-4">
            <h5 className="fw-bold mb-4">Top Rated <span className="text-success">Products</span> in {category?.name}</h5>
            <div className="row g-4">
              {products.map(product => (
                <div key={product._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .breadcrumb-item + .breadcrumb-item::before { color: rgba(255,255,255,0.5); content: "/"; }
        .subcategory-card:hover {
          transform: translateY(-5px);
          border-color: #22c55e !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
          cursor: pointer;
        }
        .subcategory-card:hover h6 { color: #22c55e; }
      `}</style>
    </div>
  );
}
