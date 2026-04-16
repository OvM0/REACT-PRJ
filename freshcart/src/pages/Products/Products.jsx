import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';

const BASE = 'https://ecommerce.routemisr.com';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`${BASE}/api/v1/categories`).then(r => setCategories(r.data.data || []));
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = `${BASE}/api/v1/products?page=${page}&limit=12`;
        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (sortBy) url += `&sort=${sortBy}`;
        const { data } = await axios.get(url);
        setProducts(data.data || []);
        setTotalPages(Math.ceil((data.results || 1) / 12));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, sortBy, page]);

  const filtered = search
    ? products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="py-5">
      <div className="container">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="fw-bold" style={{ color: '#1a1a2e' }}>
            <i className="fas fa-store me-2 text-success"></i>المنتجات
          </h1>
          <p className="text-muted">اكتشف تشكيلتنا الواسعة من المنتجات</p>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 shadow-none"
                placeholder="ابحث عن منتج..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ borderRadius: '0 10px 10px 0' }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select shadow-none"
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
              style={{ borderRadius: '10px' }}
            >
              <option value="">كل الفئات</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select shadow-none"
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              style={{ borderRadius: '10px' }}
            >
              <option value="">الترتيب الافتراضي</option>
              <option value="-price">السعر: الأعلى أولاً</option>
              <option value="price">السعر: الأقل أولاً</option>
              <option value="-ratingsAverage">الأعلى تقييماً</option>
              <option value="-sold">الأكثر مبيعاً</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-muted mb-3">
            عرض <span className="fw-bold text-success">{filtered.length}</span> منتج
          </p>
        )}

        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-4x text-muted mb-3"></i>
            <h4 className="text-muted">لا توجد منتجات مطابقة</h4>
          </div>
        ) : (
          <>
            <div className="row g-3">
              {filtered.map(product => (
                <div key={product._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(p => p - 1)}>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(p)}
                          style={p === page ? { background: '#0aad0a', borderColor: '#0aad0a' } : {}}>
                          {p}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setPage(p => p + 1)}>
                        <i className="fas fa-chevron-left"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
