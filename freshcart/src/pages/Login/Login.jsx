import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser, setUser } from '../../store/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
      password: Yup.string().min(6, 'كلمة المرور على الأقل 6 أحرف').required('كلمة المرور مطلوبة'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate('/');
      } catch (err) {
        toast.error(err || 'خطأ في تسجيل الدخول');
      }
    },
  });

  // Google OAuth Login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        
        // Try to login with Google user data via Route API
        // Since the API may not support social login directly, we simulate it
        // by using the Google token to authenticate
        toast.success(`مرحباً ${googleUser.name}! تم تسجيل الدخول بـ Google`);
        
        // Store user data from Google (demo - in production you'd verify with backend)
        const mockToken = btoa(JSON.stringify({ 
          id: googleUser.sub, 
          email: googleUser.email,
          exp: Date.now() + 86400000 
        }));
        localStorage.setItem('userToken', mockToken);
        localStorage.setItem('userName', googleUser.name);
        dispatch(setUser({ token: mockToken, name: googleUser.name }));
        navigate('/');
      } catch (err) {
        toast.error('فشل تسجيل الدخول بـ Google');
      }
    },
    onError: () => toast.error('فشل تسجيل الدخول بـ Google'),
  });

  // Facebook Login
  function handleFacebookLogin() {
    if (!window.FB) {
      toast.error('فيسبوك غير متاح حالياً');
      return;
    }
    window.FB.login(response => {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name,email' }, userData => {
          toast.success(`مرحباً ${userData.name}! تم تسجيل الدخول بـ Facebook`);
          const mockToken = btoa(JSON.stringify({ id: userData.id, email: userData.email }));
          localStorage.setItem('userToken', mockToken);
          localStorage.setItem('userName', userData.name);
          dispatch(setUser({ token: mockToken, name: userData.name }));
          navigate('/');
        });
      } else {
        toast.error('فشل تسجيل الدخول بـ Facebook');
      }
    }, { scope: 'email' });
  }

  return (
    <div className="auth-page d-flex align-items-center" style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #f0fdf0 0%, #e8f5e9 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="auth-card card border-0 shadow-lg">
              <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-5">
                  <h2 className="fw-bold mb-1">
                    <span style={{ color: '#1a1a2e' }}>Fresh</span>
                    <span style={{ color: '#0aad0a' }}>Cart</span>
                  </h2>
                  <h4 className="fw-bold mt-3" style={{ color: '#1a1a2e' }}>مرحباً بعودتك! 👋</h4>
                  <p className="text-muted">سجّل دخولك للمتابعة</p>
                </div>

                {/* Social Auth */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <button
                      className="btn btn-google w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                      onClick={() => googleLogin()}
                      type="button"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      className="btn btn-facebook w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                      onClick={handleFacebookLogin}
                      type="button"
                    >
                      <i className="fab fa-facebook-f"></i>
                      Facebook
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider-text text-center mb-4">
                  <span className="text-muted px-3" style={{ background: 'white', position: 'relative', zIndex: 1 }}>
                    أو بالبريد الإلكتروني
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                  {error && (
                    <div className="alert alert-danger rounded-3 py-2" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-exclamation-circle me-2"></i>{error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">البريد الإلكتروني</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control shadow-none border-start-0 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                        placeholder="example@email.com"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback">{formik.errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-semibold mb-0">كلمة المرور</label>
                      <Link to="/forgot-password" className="text-success text-decoration-none small">نسيت كلمة المرور؟</Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="fas fa-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className={`form-control shadow-none border-start-0 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback">{formik.errors.password}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 rounded-pill py-3 fw-bold fs-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>جاري الدخول...</>
                    ) : (
                      <><i className="fas fa-right-to-bracket me-2"></i>تسجيل الدخول</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-4 text-muted">
                  ليس لديك حساب؟{' '}
                  <Link to="/register" className="text-success fw-bold text-decoration-none">إنشاء حساب</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-card { border-radius: 24px !important; }
        .btn-google {
          background: white;
          border: 2px solid #e9ecef;
          color: #333;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-google:hover { border-color: #4285F4; box-shadow: 0 4px 12px rgba(66,133,244,0.2); }
        .btn-facebook {
          background: #1877F2;
          border: none;
          color: white;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-facebook:hover { background: #1563d1; box-shadow: 0 4px 12px rgba(24,119,242,0.3); color: white; }
        .divider-text { position: relative; }
        .divider-text::before {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 1px;
          background: #e9ecef;
        }
        .form-control, .input-group-text { border-radius: 12px !important; }
        .input-group .form-control { border-radius: 0 12px 12px 0 !important; }
        .input-group .input-group-text { border-radius: 12px 0 0 12px !important; }
      `}</style>
    </div>
  );
}
