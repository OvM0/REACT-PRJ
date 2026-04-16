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
        <nav className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">الرئيسية</Link></li>
            <li className="breadcrumb-item"><Link to="/brands" className="text-success text-decoration-none">الماركات</Link></li>
            <li className="breadcrumb-item active">{brand?.name}</li>
          </ol>
        </nav>

        {/* Brand Header */}
        {brand && (
          <div className="d-flex align-items-center gap-4 mb-5 p-4 rounded-4 shadow-sm bg-white">
            <div className="brand-logo-wrap">
              <img
                src={brand.image}
                alt={brand.name}
                style={{ maxWidth: '120px', maxHeight: '80px', objectFit: 'contain' }}
                onError={e => { e.target.src = `https://via.placeholder.com/120x80?text=${brand.name}`; }}
              />
            </div>
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>{brand.name}</h2>
              <p className="text-muted mb-0">{products.length} منتج متاح من هذه الماركة</p>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
            <h4 className="text-muted">لا توجد منتجات لهذه الماركة حالياً</h4>
            <Link to="/brands" className="btn btn-success rounded-pill mt-3 px-4">تصفح كل الماركات</Link>
          </div>
        ) : (
          <div className="row g-3">
            {products.map(product => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
