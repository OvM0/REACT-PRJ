import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/wishlistSlice';
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
  const [activeTab, setActiveTab] = useState('details');

  const isWishlisted = product && wishlistIds.includes(product._id);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${BASE}/api/v1/products/${id}`);
        setProduct(data.data);
        const relRes = await axios.get(`${BASE}/api/v1/products?category=${data.data.category?._id}&limit=10`);
        setRelated((relRes.data.data || []).filter(p => p._id !== id));
      } catch (err) {
        console.error('Error fetching product details:', err);
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
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist ❤');
      }
    } catch (err) { toast.error('Failed to update wishlist'); }
  }

  if (loading) return <Loading />;
  if (!product) return (
    <div className="text-center py-5">
      <h3 className="text-muted">Product not found</h3>
      <Link to="/products" className="btn btn-success mt-3 rounded-pill px-4">Back to Shop</Link>
    </div>
  );

  const allImages = [product.imageCover, ...(product.images || [])];

  return (
    <div className="product-details-page bg-light-subtle pb-5">
      {/* ── Breadcrumb Bar ── */}
      <div className="bg-white border-bottom py-3 mb-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 align-items-center">
              <li className="breadcrumb-item"><Link to="/" className="text-muted text-decoration-none small"><i className="fas fa-home me-1"></i> Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products" className="text-muted text-decoration-none small">{product.category?.name}</Link></li>
              <li className="breadcrumb-item"><Link to="/products" className="text-muted text-decoration-none small">{product.subcategory?.[0]?.name || 'Subcategory'}</Link></li>
              <li className="breadcrumb-item active text-dark small fw-bold text-truncate" style={{ maxWidth: '200px' }}>{product.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mt-2">
        {/* ── Main Product Section ── */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <div className="row g-0">
            {/* Left: Images */}
            <div className="col-lg-6 border-end bg-white p-4 p-md-5">
              <div className="main-image-viewport mb-4 rounded-4 overflow-hidden border d-flex align-items-center justify-content-center bg-white" style={{ minHeight: '450px' }}>
                <img src={allImages[selectedImg]} alt={product.title} className="img-fluid" style={{ maxHeight: '420px', objectFit: 'contain' }} />
              </div>
              <div className="thumbnails-grid d-flex gap-2 flex-wrap justify-content-center">
                {allImages.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImg(i)} className={`thumb-box rounded-3 overflow-hidden border-2 cursor-pointer ${selectedImg === i ? 'border-success' : 'border-light-subtle'}`} style={{ width: '80px', height: '80px', cursor: 'pointer', border: '2px solid' }}>
                    <img src={img} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="col-lg-6 bg-white p-4 p-md-5">
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 small fw-bold ls-wide">{product.category?.name}</span>
                <span className="badge bg-light text-muted border rounded-pill px-3 py-2 small fw-bold">{product.brand?.name || 'DeFacto'}</span>
              </div>
              <h1 className="fw-bold mb-3 display-6" style={{ color: '#1a1a2e' }}>{product.title}</h1>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="text-warning d-flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <i key={star} className={`fas fa-star ${star <= Math.round(product.ratingsAverage) ? '' : 'text-light'}`}></i>
                  ))}
                </div>
                <span className="text-muted small">3.7 ({product.ratingsQuantity} reviews)</span>
              </div>
              <div className="price-tag mb-4">
                <span className="display-5 fw-bold text-dark">{product.priceAfterDiscount || product.price} EGP</span>
                {product.priceAfterDiscount && <span className="text-muted text-decoration-line-through fs-4 ms-3">{product.price} EGP</span>}
              </div>
              <div className="mb-4">
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1 small">
                  <i className="fas fa-circle x-small me-1"></i> In Stock
                </span>
              </div>
              <p className="text-muted mb-4 fs-6 lh-lg">{product.description?.substring(0, 200)}...</p>
              
              <div className="mb-5">
                <div className="row g-3 align-items-end">
                  <div className="col-auto">
                    <label className="small fw-bold text-muted mb-2 d-block">Quantity</label>
                    <div className="quantity-picker d-flex align-items-center border rounded-3 p-1" style={{ width: '130px' }}>
                      <button className="btn btn-link text-dark p-0 px-3 text-decoration-none" onClick={() => setQuantity(q => Math.max(1, q - 1))}><i className="fas fa-minus small"></i></button>
                      <span className="fw-bold flex-grow-1 text-center">{quantity}</span>
                      <button className="btn btn-link text-dark p-0 px-3 text-decoration-none" onClick={() => setQuantity(q => q + 1)}><i className="fas fa-plus small"></i></button>
                    </div>
                  </div>
                  <div className="col text-end">
                    <span className="small text-muted d-block mb-1">Total Price:</span>
                    <span className="fw-bold text-success fs-4">{(product.priceAfterDiscount || product.price) * quantity} EGP</span>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-8">
                  <button className="btn btn-success btn-lg w-100 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm" onClick={handleAddToCart} disabled={addingCart}>
                    <i className="fas fa-shopping-cart"></i> {addingCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
                <div className="col-4">
                  <button className="btn btn-dark btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm"><i className="fas fa-bolt me-1"></i> Buy Now</button>
                </div>
              </div>

              <button className="btn btn-outline-light text-dark w-100 py-2 border rounded-3 mb-4 fw-semibold small d-flex align-items-center justify-content-center gap-2" onClick={handleWishlist}>
                <i className={`${isWishlisted ? 'fas text-danger' : 'far'} fa-heart`}></i> {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
              </button>

              <div className="row g-3 pt-3 border-top">
                <div className="col-6"><div className="d-flex align-items-center gap-2"><div className="bg-light rounded-circle p-2 text-success"><i className="fas fa-truck-fast"></i></div><div><span className="d-block fw-bold small">Free Delivery</span><span className="x-small text-muted">Orders over $50</span></div></div></div>
                <div className="col-6"><div className="d-flex align-items-center gap-2"><div className="bg-light rounded-circle p-2 text-success"><i className="fas fa-rotate-left"></i></div><div><span className="d-block fw-bold small">30 Days Return</span><span className="x-small text-muted">Money back guarantee</span></div></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabbed Content Section ── */}
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-5">
          {/* Tab Navigation */}
          <div className="border-bottom">
            <ul className="nav nav-tabs border-0 px-4 pt-2">
              <li className="nav-item">
                <button 
                  className={`nav-link border-0 py-3 px-4 position-relative fw-bold small d-flex align-items-center gap-2 ${activeTab === 'details' ? 'active text-success' : 'text-muted'}`}
                  onClick={() => setActiveTab('details')}
                >
                  <i className="fas fa-file-alt"></i> Product Details
                  {activeTab === 'details' && <div className="tab-indicator"></div>}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link border-0 py-3 px-4 position-relative fw-bold small d-flex align-items-center gap-2 ${activeTab === 'reviews' ? 'active text-success' : 'text-muted'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  <i className="fas fa-star"></i> Reviews ({product.ratingsQuantity})
                  {activeTab === 'reviews' && <div className="tab-indicator"></div>}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link border-0 py-3 px-4 position-relative fw-bold small d-flex align-items-center gap-2 ${activeTab === 'shipping' ? 'active text-success' : 'text-muted'}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  <i className="fas fa-truck"></i> Shipping & Returns
                  {activeTab === 'shipping' && <div className="tab-indicator"></div>}
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-4 p-md-5">
            {/* 1. Details Tab Content */}
            {activeTab === 'details' && (
              <div className="tab-pane-content fade-in">
                <div className="row g-5">
                  <div className="col-lg-7">
                    <h5 className="fw-bold mb-4">About this Product</h5>
                    <p className="text-muted lh-lg">{product.description}</p>
                    <div className="mt-5">
                      <h5 className="fw-bold mb-4">Product Information</h5>
                      <div className="table-responsive">
                        <table className="table table-borderless align-middle mb-0">
                          <tbody className="small">
                            <tr className="border-bottom"><td className="text-muted py-3 ps-0" style={{ width: '180px' }}>Category</td><td className="fw-bold text-end py-3 pe-0 text-success">{product.category?.name}</td></tr>
                            <tr className="border-bottom"><td className="text-muted py-3 ps-0">Subcategory</td><td className="fw-bold text-end py-3 pe-0 text-dark">{product.subcategory?.[0]?.name || 'N/A'}</td></tr>
                            <tr className="border-bottom"><td className="text-muted py-3 ps-0">Brand</td><td className="fw-bold text-end py-3 pe-0 text-dark">{product.brand?.name || 'Generic'}</td></tr>
                            <tr><td className="text-muted py-3 ps-0">Items Sold</td><td className="fw-bold text-end py-3 pe-0 text-dark">{product.sold}+ sold</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="card border p-4 rounded-4 bg-light bg-opacity-50">
                      <h5 className="fw-bold mb-4">Key Features</h5>
                      <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                        {['Premium Quality Product', '100% Authentic Guarantee', 'Fast & Secure Packaging', 'Quality Tested'].map((f, i) => (
                          <li key={i} className="d-flex align-items-center gap-3">
                            <div className="bg-success-light text-success rounded-circle p-1" style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-check" style={{ fontSize: '0.6rem' }}></i></div>
                            <span className="fw-semibold small">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Reviews Tab Content */}
            {activeTab === 'reviews' && (
              <div className="tab-pane-content fade-in">
                <div className="row g-5 align-items-center">
                  <div className="col-md-4 text-center border-end">
                    <h1 className="display-3 fw-bold mb-1">{product.ratingsAverage?.toFixed(1)}</h1>
                    <div className="text-warning mb-2">
                      {[1, 2, 3, 4, 5].map(s => <i key={s} className="fas fa-star me-1"></i>)}
                    </div>
                    <p className="text-muted small">Based on {product.ratingsQuantity} reviews</p>
                  </div>
                  <div className="col-md-8 px-lg-5">
                    {[
                      { s: 5, p: 25 }, { s: 4, p: 60 }, { s: 3, p: 25 }, { s: 2, p: 5 }, { s: 1, p: 5 }
                    ].map(row => (
                      <div key={row.s} className="d-flex align-items-center gap-3 mb-2">
                        <span className="small text-muted" style={{ width: '40px' }}>{row.s} star</span>
                        <div className="progress flex-grow-1" style={{ height: '6px' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${row.p}%` }}></div>
                        </div>
                        <span className="small text-muted" style={{ width: '30px' }}>{row.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center py-5 mt-4 border-top">
                  <i className="fas fa-star-half-alt fs-1 text-muted opacity-25 mb-3"></i>
                  <p className="text-muted">Customer reviews will be displayed here.</p>
                  <button className="btn btn-link text-success fw-bold text-decoration-none">Write a Review</button>
                </div>
              </div>
            )}

            {/* 3. Shipping Tab Content */}
            {activeTab === 'shipping' && (
              <div className="tab-pane-content fade-in">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-4 rounded-4" style={{ background: '#f0fdf4' }}>
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                          <i className="fas fa-truck"></i>
                        </div>
                        <h5 className="fw-bold mb-0">Shipping Information</h5>
                      </div>
                      <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                        {['Free shipping on orders over $50', 'Standard delivery: 3-5 business days', 'Express delivery available (1-2 business days)', 'Track your order in real-time'].map((t, i) => (
                          <li key={i} className="d-flex align-items-center gap-3 text-dark small fw-semibold">
                            <i className="fas fa-check text-success"></i> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-4 rounded-4" style={{ background: '#f0fdf4' }}>
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                          <i className="fas fa-rotate-left"></i>
                        </div>
                        <h5 className="fw-bold mb-0">Returns & Refunds</h5>
                      </div>
                      <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                        {['30-day hassle-free returns', 'Full refund or exchange available', 'Free return shipping on defective items', 'Easy online return process'].map((t, i) => (
                          <li key={i} className="d-flex align-items-center gap-3 text-dark small fw-semibold">
                            <i className="fas fa-check text-success"></i> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-12 mt-4">
                    <div className="p-4 border rounded-4 d-flex align-items-center gap-4">
                      <div className="bg-light rounded-circle p-3"><i className="fas fa-shield-alt text-muted fs-4"></i></div>
                      <div>
                        <h6 className="fw-bold mb-1">Buyer Protection Guarantee</h6>
                        <p className="small text-muted mb-0">Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping experience is safe and secure.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        <div className="mt-5 pt-4">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-1">
            <div className="d-flex align-items-center gap-2">
              <div style={{ height: '30px', width: '5px', backgroundColor: '#0aad0a', borderRadius: '10px' }}></div>
              <h3 className="fw-bold mb-0">You May Also <span className="text-success">Like</span></h3>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light border rounded-circle text-dark p-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="fas fa-chevron-left small"></i></button>
              <button className="btn btn-outline-light border rounded-circle text-dark p-0 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="fas fa-chevron-right small"></i></button>
            </div>
          </div>
          <div className="row g-4">
            {related.slice(0, 5).map(p => (
              <div key={p._id} className="col-6 col-md-4 col-lg-3 col-xl-2.4">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .product-details-page { font-family: 'Inter', sans-serif; }
        .ls-wide { letter-spacing: 0.05em; }
        .x-small { font-size: 0.7rem; }
        .bg-success-light { background: #f0fdf4; }
        .breadcrumb-item + .breadcrumb-item::before { content: ">"; color: #adb5bd; font-size: 0.8rem; }
        .thumb-box { transition: all 0.2s; }
        .thumb-box:hover { border-color: #0aad0a !important; }
        .col-xl-2\.4 { width: 20%; }
        .nav-link.active { color: #0aad0a !important; }
        .tab-indicator {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px; background: #0aad0a;
          border-radius: 3px 3px 0 0;
        }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 1200px) { .col-xl-2\.4 { width: 25%; } }
        @media (max-width: 991px) { .col-xl-2\.4 { width: 33.33%; } }
        @media (max-width: 767px) { .col-xl-2\.4 { width: 50%; } }
      `}</style>
    </div>
  );
}
