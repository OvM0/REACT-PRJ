import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';

const BASE = 'https://ecommerce.routemisr.com';

export default function CategoryProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${BASE}/api/v1/categories/${id}`),
          axios.get(`${BASE}/api/v1/products?category=${id}&limit=20`),
        ]);
        setCategory(catRes.data.data);
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
        {/* Breadcrumb */}
        <nav className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">الرئيسية</Link></li>
            <li className="breadcrumb-item"><Link to="/categories" className="text-success text-decoration-none">الفئات</Link></li>
            <li className="breadcrumb-item active">{category?.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        {category && (
          <div className="category-hero rounded-4 mb-5 overflow-hidden position-relative">
            <img
              src={category.image}
              alt={category.name}
              className="w-100"
              style={{ height: '220px', objectFit: 'cover', filter: 'brightness(0.5)' }}
            />
            <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
              <h1 className="fw-bold display-5">{category.name}</h1>
              <p className="mb-0">{products.length} منتج متاح</p>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-4x text-muted mb-3"></i>
            <h4 className="text-muted">لا توجد منتجات في هذه الفئة حالياً</h4>
            <Link to="/products" className="btn btn-success rounded-pill mt-3 px-4">تصفح كل المنتجات</Link>
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
