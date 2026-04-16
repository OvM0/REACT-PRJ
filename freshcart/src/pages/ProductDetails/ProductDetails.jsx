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
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    setAddingCart(true);
    try {
      await dispatch(addToCart(product._id)).unwrap();
      toast.success('Successfully added to cart ✓');
    } catch (err) {
      toast.error(err || 'Something went wrong');
    } finally {
      setAddingCart(false);
    }
  }

  async function handleWishlist() {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    if (isWishlisted) {
      await dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      await dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist ❤');
    }
  }

  if (loading) return <Loading />;
  if (!product) return (
    <div className="text-center py-5">
      <h3 className="text-muted">Product not found</h3>
      <Link to="/products" className="btn btn-success mt-3 rounded-pill px-4">Back to Shop</Link>
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
            <li className="breadcrumb-item"><Link to="/" className="text-success text-decoration-none small fw-bold">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-success text-decoration-none small fw-bold">Products</Link></li>
            <li className="breadcrumb-item active small text-truncate" style={{ maxWidth: '200px' }}>{product.title}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Images */}
          <div className="col-lg-5">
            <div className="product-detail-imgs">
              <div className="main-img-wrap mb-3 position-relative rounded-4 overflow-hidden shadow-sm border">
                {discount && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-3 rounded-pill fs-6 px-3 z-3">
                    -{discount}% OFF
                  </span>
                )}
                <img
                  src={allImages[selectedImg]}
                  alt={product.title}
                  className="img-fluid w-100"
                  style={{ maxHeight: '500px', objectFit: 'contain', background: '#fff' }}
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
                    className="thumb-img rounded-3"
                    style={{
                      width: '75px', height: '75px', objectFit: 'cover', cursor: 'pointer',
                      border: i === selectedImg ? '2px solid #0aad0a' : '2px solid #eee',
                      opacity: i === selectedImg ? 1 : 0.6, transition: 'all 0.2s'
                    }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/75?text=N/A'; }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill px-3 py-2" style={{ background: '#f0fdf4', color: '#0aad0a', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                {product.category?.name?.toUpperCase()}
              </span>
              {product.sold > 100 && <span className="badge bg-warning text-dark rounded-pill px-3 py-2" style={{ fontSize: '0.75rem', fontWeight: '700' }}>BEST SELLER</span>}
            </div>
            
            <h1 className="fw-bold mb-3 display-6" style={{ color: '#1a1a2e', lineHeight: 1.3 }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <i key={s} className={`fa-star ${s <= Math.round(product.ratingsAverage) ? 'fas' : 'far'}`}
                    style={{ color: '#ffc107', fontSize: '0.9rem' }}></i>
                ))}
                <span className="ms-2 fw-bold" style={{ color: '#1a1a2e' }}>{product.ratingsAverage?.toFixed(1)}</span>
              </div>
              <span className="text-muted small">({product.ratingsQuantity} reviews)</span>
              <span className="text-muted small">•</span>
              <span className="text-success small fw-bold">{product.sold} sold</span>
            </div>

            {/* Brand */}
            {product.brand && (
              <p className="mb-4">
                <span className="text-muted small fw-600">Brand:</span> 
                <span className="ms-2 fw-bold text-dark">{product.brand.name}</span>
              </p>
            )}

            {/* Price */}
            <div className="price-card mb-4 p-4 rounded-4" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-success" style={{ fontSize: '2.4rem' }}>
                  {product.priceAfterDiscount || product.price} <small style={{ fontSize: '1rem' }}>EGP</small>
                </span>
                {product.priceAfterDiscount && (
                  <span className="text-muted text-decoration-line-through fs-5">{product.price} EGP</span>
                )}
                {product.priceAfterDiscount && (
                  <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">You Save {product.price - product.priceAfterDiscount} EGP</span>
                )}
              </div>
              <p className="small text-muted mt-2 mb-0"><i className="fas fa-info-circle me-1"></i> Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">Product Description</h6>
              <p className="text-muted" style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>
            </div>

            {/* Quantity & Actions */}
            <div className="row g-3 align-items-center mb-5">
              <div className="col-auto">
                <div className="quantity-toggle d-flex align-items-center border rounded-pill p-1 bg-white shadow-sm">
                  <button className="btn btn-sm btn-link text-dark text-decoration-none px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}><i className="fas fa-minus small"></i></button>
                  <span className="fw-bold px-2" style={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
                  <button className="btn btn-sm btn-link text-dark text-decoration-none px-3" onClick={() => setQuantity(q => q + 1)}><i className="fas fa-plus small"></i></button>
                </div>
              </div>
              <div className="col">
                <button
                  className="btn btn-success rounded-pill w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm transition-300"
                  onClick={handleAddToCart}
                  disabled={addingCart}
                  style={{ fontSize: '1.1rem' }}
                >
                  {addingCart
                    ? <><span className="spinner-border spinner-border-sm"></span> Processing...</>
                    : <><i className="fas fa-shopping-basket"></i> Add to Cart</>
                  }
                </button>
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-outline-light border rounded-pill p-3 shadow-sm transition-300"
                  onClick={handleWishlist}
                  style={{ color: isWishlisted ? '#ef4444' : '#64748b', borderColor: '#e2e8f0', background: isWishlisted ? '#fef2f2' : '#fff' }}
                >
                  <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart fs-5`}></i>
                </button>
              </div>
            </div>

            {/* Service Highlights */}
            <div className="p-4 rounded-4 bg-white border shadow-sm">
              <div className="row g-4 text-center">
                <div className="col-4">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-truck"></i>
                  </div>
                  <small className="fw-bold d-block">Free Delivery</small>
                </div>
                <div className="col-4">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <small className="fw-bold d-block">Secure Payment</small>
                </div>
                <div className="col-4">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '45px', height: '45px' }}>
                    <i className="fas fa-rotate-left"></i>
                  </div>
                  <small className="fw-bold d-block">14-Day Returns</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-5 pt-5 border-top">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div style={{ height: '30px', width: '5px', backgroundColor: '#0aad0a', borderRadius: '10px' }}></div>
              <h3 className="fw-bold mb-0">Related <span className="text-success">Products</span></h3>
            </div>
            <div className="row g-4">
              {related.map(p => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .breadcrumb-item + .breadcrumb-item::before { content: "›"; color: #0aad0a; font-size: 1.2rem; }
        .transition-300 { transition: all 0.3s ease; }
        .transition-300:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important; }
        .fw-600 { font-weight: 600; }
      `}</style>
    </div>
  );
}
