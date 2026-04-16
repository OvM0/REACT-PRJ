import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../store/authSlice';
import toast from 'react-hot-toast';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', rePassword: '', phone: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'الاسم على الأقل 3 أحرف').max(32, 'الاسم طويل جداً').required('الاسم مطلوب'),
      email: Yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
      password: Yup.string()
        .min(6, 'كلمة المرور على الأقل 6 أحرف')
        .matches(/^(?=.*[A-Z])(?=.*\d)/, 'يجب أن تحتوي على حرف كبير ورقم')
        .required('كلمة المرور مطلوبة'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password')], 'كلمتا المرور غير متطابقتين')
        .required('تأكيد كلمة المرور مطلوب'),
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, 'رقم هاتف مصري غير صحيح')
        .required('رقم الهاتف مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(registerUser(values)).unwrap();
        toast.success('تم إنشاء الحساب بنجاح!');
        navigate('/');
      } catch (err) {
        toast.error(err || 'خطأ في إنشاء الحساب');
      }
    },
  });

  const fields = [
    { name: 'name', label: 'الاسم الكامل', icon: 'fa-user', type: 'text', placeholder: 'أحمد محمد' },
    { name: 'email', label: 'البريد الإلكتروني', icon: 'fa-envelope', type: 'email', placeholder: 'example@email.com' },
    { name: 'phone', label: 'رقم الهاتف', icon: 'fa-phone', type: 'tel', placeholder: '01xxxxxxxxx' },
    { name: 'password', label: 'كلمة المرور', icon: 'fa-lock', type: 'password', placeholder: '••••••••' },
    { name: 'rePassword', label: 'تأكيد كلمة المرور', icon: 'fa-lock', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="auth-page d-flex align-items-center py-5" style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #f0fdf0 0%, #e8f5e9 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '24px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1">
                    <span style={{ color: '#1a1a2e' }}>Fresh</span>
                    <span style={{ color: '#0aad0a' }}>Cart</span>
                  </h2>
                  <h4 className="fw-bold mt-3" style={{ color: '#1a1a2e' }}>إنشاء حساب جديد 🎉</h4>
                  <p className="text-muted">انضم إلينا وابدأ التسوق</p>
                </div>

                {error && (
                  <div className="alert alert-danger rounded-3 py-2" style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                  <div className="row g-3">
                    {fields.map(field => (
                      <div key={field.name} className="col-12">
                        <label className="form-label fw-semibold">{field.label}</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                            <i className={`fas ${field.icon} text-muted`}></i>
                          </span>
                          <input
                            type={field.type}
                            className={`form-control shadow-none border-start-0 ${formik.touched[field.name] && formik.errors[field.name] ? 'is-invalid' : formik.touched[field.name] && !formik.errors[field.name] ? 'is-valid' : ''}`}
                            placeholder={field.placeholder}
                            name={field.name}
                            value={formik.values[field.name]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ borderRadius: '0 12px 12px 0' }}
                          />
                          {formik.touched[field.name] && formik.errors[field.name] && (
                            <div className="invalid-feedback">{formik.errors[field.name]}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 rounded-pill py-3 fw-bold fs-5 mt-4"
                    disabled={loading || !formik.isValid || !formik.dirty}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>جاري الإنشاء...</>
                    ) : (
                      <><i className="fas fa-user-plus me-2"></i>إنشاء الحساب</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-4 text-muted">
                  لديك حساب بالفعل؟{' '}
                  <Link to="/login" className="text-success fw-bold text-decoration-none">تسجيل الدخول</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
