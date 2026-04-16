import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../components/Loading/Loading';

const BASE = 'https://ecommerce.routemisr.com';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Decode user id from token
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${BASE}/api/v1/orders/user/${userId}`)
      .then(r => setOrders(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Loading />;

  if (orders.length === 0) {
    return (
      <div className="py-5">
        <div className="container text-center py-5">
          <i className="fas fa-box-open fa-5x text-muted mb-4" style={{ opacity: 0.3 }}></i>
          <h2 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>لا توجد طلبات بعد</h2>
          <p className="text-muted mb-4">ابدأ التسوق الآن وستجد طلباتك هنا</p>
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
        <div className="mb-4">
          <h1 className="fw-bold" style={{ color: '#1a1a2e' }}>
            <i className="fas fa-box me-2 text-success"></i>طلباتي
          </h1>
          <p className="text-muted">{orders.length} طلب في سجلك</p>
        </div>

        <div className="row g-4">
          {orders.map(order => (
            <div key={order._id} className="col-12">
              <div className="order-card card border-0 shadow-sm">
                <div className="card-body p-4">
                  {/* Order Header */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                    <div>
                      <h6 className="fw-bold mb-1">
                        <i className="fas fa-hashtag text-success me-1"></i>
                        طلب رقم: <span className="text-success">{order.id || order._id?.slice(-6)}</span>
                      </h6>
                      <p className="text-muted small mb-0">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <span className={`badge rounded-pill fs-6 ${order.isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
                        <i className={`fas ${order.isPaid ? 'fa-check-circle' : 'fa-clock'} me-1`}></i>
                        {order.isPaid ? 'مدفوع' : 'غير مدفوع'}
                      </span>
                      <span className={`badge rounded-pill fs-6 ${order.isDelivered ? 'bg-info' : 'bg-secondary'}`}>
                        <i className={`fas ${order.isDelivered ? 'fa-truck' : 'fa-hourglass-half'} me-1`}></i>
                        {order.isDelivered ? 'تم التوصيل' : 'قيد المعالجة'}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="order-products mb-4">
                    <div className="row g-2">
                      {order.cartItems?.slice(0, 4).map((item, i) => (
                        <div key={i} className="col-6 col-md-3">
                          <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: '#f8f9fa' }}>
                            <img
                              src={item.product?.imageCover}
                              alt={item.product?.title}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                              onError={e => { e.target.src = 'https://via.placeholder.com/50?text=N/A'; }}
                            />
                            <div className="overflow-hidden">
                              <p className="mb-0 small fw-semibold text-truncate">{item.product?.title}</p>
                              <p className="mb-0 small text-muted">× {item.count}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.cartItems?.length > 4 && (
                        <div className="col-6 col-md-3">
                          <div className="d-flex align-items-center justify-content-center p-2 rounded-3 h-100"
                            style={{ background: '#f8f9fa', border: '2px dashed #dee2e6' }}>
                            <p className="text-muted mb-0 small">+{order.cartItems.length - 4} منتجات أخرى</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top">
                    <div className="d-flex gap-4">
                      <div>
                        <p className="text-muted small mb-0">طريقة الدفع</p>
                        <p className="fw-semibold mb-0">
                          <i className={`fas ${order.paymentMethodType === 'card' ? 'fa-credit-card text-primary' : 'fa-money-bill text-success'} me-1`}></i>
                          {order.paymentMethodType === 'card' ? 'بطاقة بنكية' : 'كاش عند الاستلام'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted small mb-0">عدد المنتجات</p>
                        <p className="fw-semibold mb-0">{order.cartItems?.length} منتج</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="text-muted small mb-0">الإجمالي</p>
                      <p className="fw-bold text-success fs-5 mb-0">
                        {order.totalOrderPrice?.toLocaleString()} جنيه
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .order-card { border-radius: 20px !important; transition: box-shadow 0.2s; }
        .order-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}
