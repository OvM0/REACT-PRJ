import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../store/wishlistSlice';
import { addToCart } from '../../store/cartSlice';
import Loading from '../../components/Loading/Loading';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { wishlistItems, loading } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  async function handleRemove(productId) {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('تمت الإزالة من المفضلة');
    } catch { toast.error('حدث خطأ'); }
  }

  async function handleAddToCart(productId) {
    try {
      await dispatch(addToCart(productId)).unwrap();
      toast.success('تمت الإضافة للسلة ✓');
    } catch (err) { toast.error(err || 'حدث خطأ'); }
  }

  if (loading) return <Loading />;

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="py-5">
        <div className="container text-center py-5">
          <i className="fas fa-heart-crack fa-5x mb-4" style={{ color: '#e74c3c', opacity: 0.3 }}></i>
          <h2 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>قائمة الأمنيات فارغة</h2>
          <p className="text-muted mb-4">أضف المنتجات التي تعجبك لتجدها هنا بسهولة</p>
          <Link to="/products" className="btn btn-success rounded-pill px-5 py-2 fw-bold">
            <i className="fas fa-store me-2"></i>تسوق الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>
              <i className="fas fa-heart me-2 text-danger"></i>قائمة الأمنيات
            </h1>
            <p className="text-muted mb-0">{wishlistItems.length} منتج في قائمتك</p>
          </div>
        </div>

        <div className="row g-3">
          {wishlistItems.map(product => {
            const discount = product.priceAfterDiscount
              ? Math.round((1 - product.priceAfterDiscount / product.price) * 100) : null;

            return (
              <div key={product._id} className="col-12 col-md-6 col-lg-4">
                <div className="wishlist-card card border-0 shadow-sm h-100 position-relative">
                  {discount && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2 rounded-pill">
                      -{discount}%
                    </span>
                  )}
                  <button
                    className="remove-wish-btn position-absolute"
                    onClick={() => handleRemove(product._id)}
                    title="إزالة من المفضلة"
                  >
                    <i className="fas fa-times"></i>
                  </button>

                  <Link to={`/products/${product._id}`} className="text-decoration-none">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                    />
                    <div className="card-body p-3">
                      <p className="text-success small fw-semibold mb-1">{product.category?.name}</p>
                      <h6 className="fw-bold text-dark text-truncate mb-2">{product.title}</h6>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <span className="fw-bold text-success">
                            {product.priceAfterDiscount || product.price} جنيه
                          </span>
                          {product.priceAfterDiscount && (
                            <span className="text-muted text-decoration-line-through ms-2 small">
                              {product.price} جنيه
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <i className="fa-solid fa-star" style={{ color: '#f39c12', fontSize: '0.8rem' }}></i>
                          <small className="text-muted">{product.ratingsAverage?.toFixed(1)}</small>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="card-footer bg-transparent border-0 p-3 pt-0">
                    <button
                      className="btn btn-success w-100 rounded-pill btn-sm fw-semibold"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      <i className="fas fa-cart-plus me-2"></i>أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .wishlist-card { border-radius: 16px !important; transition: all 0.3s; }
        .wishlist-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.12) !important; }
        .remove-wish-btn {
          top: 10px; right: 10px;
          background: white;
          border: none;
          border-radius: 50%;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          color: #e74c3c;
          cursor: pointer;
          z-index: 1;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .remove-wish-btn:hover { background: #e74c3c; color: white; transform: scale(1.1); }
      `}</style>
    </div>
  );
}
