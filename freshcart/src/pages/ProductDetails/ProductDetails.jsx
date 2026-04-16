import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/wishlistSlice';
import { useSelector } from 'react-redux';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loading from '../../components/Loading/Loading';
import toast from 'react-hot-toast';

const BASE = 'https://ecommerce.routemisr.com';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { wishlistIds } = useSelector(state => state.wishlist);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);

  const isWishlisted = product && wishlistIds.includes(product._id);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BASE}/api/v1/products/${id}`);
        setProduct(data.data);
        // Fetch related
        const relRes = await axios.get(`${BASE}/api/v1/products?category=${data.data.category?._id}&limit=4`);
        setRelated((relRes.data.data || []).filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  async function handleAddToCart() {
    if (!isAuthenticated) { toast.error('يجب تسجيل الدخول أولاً'); return; }
    setAddingCart(true);
    try {
      await dispatch(addToCart(product._id)).unwrap();
      toast.success('تمت الإضافة إلى السلة ✓');
    } catch (err) {
      toast.error(err || 'حدث خطأ');
    } finally {
      setAddingCart(false);
    }
  }

  async function handleWishlist() {
    if (!isAuthenticated) { toast.error('يجب تسجيل الدخول أولاً'); return; }
    if (isWishlisted) {
      await dispatch(removeFromWishlist(product._id));
      toast.success('تمت الإزالة من المفضلة');
    } else {
      await dispatch(addToWishlist(product._id));
      toast.success('تمت الإضافة للمفضلة ❤');
    }
  }

  if (loading) return <Loading />;
  if (!product) return (
    <div className="text-center py-5">
      <h3 className="text-muted">المنتج غير موجود</h3>
      <Link to="/products" className="btn btn-success mt-3">العودة للمنتجات</Link>
    </div>
  );

  const allImages = [product.imageCover, ...(product.images || [])];
  const discount = product.priceAfterDiscount
    ? Math.round((1 - product.priceAfterDiscount / product.price) * 100) : null;

  return (
    <div className="py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none">الرئيسية</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-success text-decoration-none">المنتجات</Link></li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }}>{product.title}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Images */}
          <div className="col-lg-5">
            <div className="product-detail-imgs">
              <div className="main-img-wrap mb-3">
                {discount && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-3 rounded-pill fs-6">
                    -{discount}%
                  </span>
                )}
                <img
                  src={allImages[selectedImg]}
                  alt={product.title}
                  className="img-fluid w-100 rounded-3"
                  style={{ maxHeight: '450px', objectFit: 'contain', background: '#f8f9fa' }}
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
                />
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {allImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setSelectedImg(i)}
                    className="thumb-img rounded-2"
                    style={{
                      width: '70px', height: '70px', objectFit: 'cover', cursor: 'pointer',
                      border: i === selectedImg ? '2px solid #0aad0a' : '2px solid transparent',
                      opacity: i === selectedImg ? 1 : 0.6, transition: 'all 0.2s'
                    }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/70?text=N/A'; }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="col-lg-7">
            <span className="badge rounded-pill mb-2" style={{ background: '#e8f5e9', color: '#0aad0a', fontSize: '0.85rem' }}>
              {product.category?.name}
            </span>
            <h1 className="fw-bold mb-3" style={{ color: '#1a1a2e', fontSize: '1.6rem', lineHeight: 1.4 }}>
              {product.title}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p className="text-muted mb-2">
                <span className="fw-semibold">الماركة:</span> {product.brand.name}
              </p>
            )}

            {/* Rating */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <i key={s} className={`fa-${s <= Math.round(product.ratingsAverage) ? 'solid' : 'regular'} fa-star`}
                    style={{ color: '#f39c12' }}></i>
                ))}
              </div>
              <span className="fw-bold" style={{ color: '#f39c12' }}>{product.ratingsAverage?.toFixed(1)}</span>
              <span className="text-muted">({product.ratingsQuantity} تقييم)</span>
              {product.sold > 0 && <span className="text-muted">· {product.sold} مبيع</span>}
            </div>

            {/* Price */}
            <div className="price-section mb-4 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
              <div className="d-flex align-items-baseline gap-3">
                <span className="fw-bold text-success" style={{ fontSize: '2rem' }}>
                  {product.priceAfterDiscount || product.price} <small style={{ fontSize: '1rem' }}>جنيه</small>
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-muted text-decoration-line-through fs-5">{product.price} جنيه</span>
                )}
                {discount && (
                  <span className="badge bg-danger rounded-pill">توفير {product.price - product.priceAfterDiscount} جنيه</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted mb-4" style={{ lineHeight: 2 }}>{product.description}</p>

            {/* Quantity */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <label className="fw-semibold">الكمية:</label>
              <div className="input-group" style={{ width: '130px' }}>
                <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <input type="number" className="form-control text-center border-secondary shadow-none" value={quantity} readOnly />
                <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-3 flex-wrap">
              <button
                className="btn btn-success rounded-pill px-5 py-2 fw-bold flex-grow-1"
                onClick={handleAddToCart}
                disabled={addingCart}
              >
                {addingCart
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>جاري الإضافة...</>
                  : <><i className="fas fa-cart-plus me-2"></i>أضف للسلة</>
                }
              </button>
              <button
                className="btn rounded-pill px-4 py-2"
                onClick={handleWishlist}
                style={{ border: '2px solid', borderColor: isWishlisted ? '#e74c3c' : '#dee2e6', color: isWishlisted ? '#e74c3c' : '#636e72' }}
              >
                <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart me-2`}></i>
                {isWishlisted ? 'في المفضلة' : 'أضف للمفضلة'}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-4 p-3 rounded-3 border" style={{ borderColor: '#e9ecef !important' }}>
              <div className="row g-2 text-center">
                <div className="col-4">
                  <i className="fas fa-truck text-success d-block mb-1"></i>
                  <small className="text-muted">توصيل مجاني</small>
                </div>
                <div className="col-4">
                  <i className="fas fa-shield-halved text-success d-block mb-1"></i>
                  <small className="text-muted">دفع آمن</small>
                </div>
                <div className="col-4">
                  <i className="fas fa-rotate-left text-success d-block mb-1"></i>
                  <small className="text-muted">إرجاع 14 يوم</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-5 pt-4" style={{ borderTop: '2px solid #f0f0f0' }}>
            <h3 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>منتجات مشابهة</h3>
            <div className="row g-3">
              {related.slice(0, 4).map(p => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
