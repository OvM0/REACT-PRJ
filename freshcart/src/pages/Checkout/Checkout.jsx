import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE = 'https://ecommerce.routemisr.com';

export default function Checkout() {
  const { cartId } = useParams();
  const navigate = useNavigate();
  const { totalPrice, numOfCartItems } = useSelector(state => state.cart);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'online'
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      details: '',
      phone: '',
      city: '',
    },
    validationSchema: Yup.object({
      details: Yup.string().required('العنوان مطلوب').min(10, 'العنوان قصير جداً'),
      phone: Yup.string().required('رقم الهاتف مطلوب').matches(/^01[0125][0-9]{8}$/, 'رقم هاتف مصري غير صحيح'),
      city: Yup.string().required('المدينة مطلوبة').min(3, 'اسم المدينة قصير جداً'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem('userToken');
        if (paymentMethod === 'cash') {
          const { data } = await axios.post(
            `${BASE}/api/v1/orders/${cartId}`,
            { shippingAddress: values },
            { headers: { token } }
          );
          if (data.status === 'success') {
            toast.success('تم تقديم الطلب بنجاح!');
            navigate('/allorders');
          }
        } else {
          // Online payment - redirect to payment gateway
          const { data } = await axios.post(
            `${BASE}/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
            { shippingAddress: values },
            { headers: { token } }
          );
          if (data.status === 'success') {
            window.location.href = data.session.url;
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'حدث خطأ، حاول مرة أخرى');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="py-5" style={{ background: '#f8f9fa', minHeight: '80vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="fw-bold" style={{ color: '#1a1a2e' }}>
                <i className="fas fa-lock me-2 text-success"></i>إتمام الطلب
              </h1>
              <p className="text-muted">أكمل بياناتك وادفع بأمان</p>
            </div>

            <div className="row g-4">
              {/* Checkout Form */}
              <div className="col-lg-7">
                <form onSubmit={formik.handleSubmit}>
                  {/* Shipping Info */}
                  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>
                        <i className="fas fa-map-marker-alt me-2 text-success"></i>بيانات الشحن
                      </h5>

                      {/* Details */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold">العنوان التفصيلي</label>
                        <textarea
                          className={`form-control shadow-none ${formik.touched.details && formik.errors.details ? 'is-invalid' : ''}`}
                          rows={3}
                          placeholder="الشارع، المبنى، الدور..."
                          name="details"
                          value={formik.values.details}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{ borderRadius: '12px' }}
                        />
                        {formik.touched.details && formik.errors.details && (
                          <div className="invalid-feedback">{formik.errors.details}</div>
                        )}
                      </div>

                      <div className="row g-3">
                        {/* Phone */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">رقم الهاتف</label>
                          <input
                            type="tel"
                            className={`form-control shadow-none ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                            placeholder="01xxxxxxxxx"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ borderRadius: '12px' }}
                          />
                          {formik.touched.phone && formik.errors.phone && (
                            <div className="invalid-feedback">{formik.errors.phone}</div>
                          )}
                        </div>

                        {/* City */}
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">المدينة</label>
                          <input
                            type="text"
                            className={`form-control shadow-none ${formik.touched.city && formik.errors.city ? 'is-invalid' : ''}`}
                            placeholder="القاهرة، الجيزة، الإسكندرية..."
                            name="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ borderRadius: '12px' }}
                          />
                          {formik.touched.city && formik.errors.city && (
                            <div className="invalid-feedback">{formik.errors.city}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4">
                      <h5 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>
                        <i className="fas fa-credit-card me-2 text-success"></i>طريقة الدفع
                      </h5>

                      <div className="row g-3">
                        <div className="col-6">
                          <div
                            className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('cash')}
                          >
                            <i className="fas fa-money-bill-wave fa-2x text-success mb-2"></i>
                            <p className="fw-bold mb-0">الدفع عند الاستلام</p>
                            <small className="text-muted">كاش عند التوصيل</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className={`payment-option ${paymentMethod === 'online' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('online')}
                          >
                            <i className="fas fa-credit-card fa-2x text-primary mb-2"></i>
                            <p className="fw-bold mb-0">الدفع أونلاين</p>
                            <small className="text-muted">Visa / MasterCard</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 rounded-pill py-3 fw-bold fs-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>جاري المعالجة...</>
                    ) : paymentMethod === 'cash' ? (
                      <><i className="fas fa-check-circle me-2"></i>تأكيد الطلب</>
                    ) : (
                      <><i className="fas fa-lock me-2"></i>ادفع بأمان</>
                    )}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm sticky-top" style={{ borderRadius: '20px', top: '80px' }}>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4" style={{ color: '#1a1a2e' }}>
                      <i className="fas fa-receipt me-2 text-success"></i>ملخص الطلب
                    </h5>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">المنتجات ({numOfCartItems})</span>
                      <span className="fw-semibold">{totalPrice?.toLocaleString()} جنيه</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">الشحن</span>
                      <span className="text-success fw-semibold">
                        {totalPrice >= 500 ? 'مجاني' : '50 جنيه'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">الضريبة</span>
                      <span>0 جنيه</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold fs-5">الإجمالي</span>
                      <span className="fw-bold fs-5 text-success">
                        {(totalPrice + (totalPrice < 500 ? 50 : 0)).toLocaleString()} جنيه
                      </span>
                    </div>

                    <div className="mt-4 p-3 rounded-3" style={{ background: '#f0fdf0' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="fas fa-shield-halved text-success"></i>
                        <span className="small fw-semibold">دفع آمن ومشفر 100%</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="fas fa-rotate-left text-success"></i>
                        <span className="small fw-semibold">إرجاع مجاني خلال 14 يوم</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="fas fa-headset text-success"></i>
                        <span className="small fw-semibold">دعم متواصل 24/7</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2 justify-content-center mt-3">
                      {['visa', 'cc-mastercard', 'cc-paypal', 'cc-amex'].map(c => (
                        <i key={c} className={`fab fa-${c} fa-2x text-muted`}></i>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .payment-option {
          border: 2px solid #e9ecef;
          border-radius: 16px;
          padding: 20px 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .payment-option:hover { border-color: #0aad0a; background: #f0fdf0; }
        .payment-option.active { border-color: #0aad0a; background: #f0fdf0; box-shadow: 0 0 0 3px rgba(10,173,10,0.15); }
      `}</style>
    </div>
  );
}
