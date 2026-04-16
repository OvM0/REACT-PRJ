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
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        toast.success('Signed in successfully!');
        navigate('/');
      } catch (err) {
        toast.error(err || 'Login failed');
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
        
        toast.success(`Welcome ${googleUser.name}! Signed in with Google`);
        
        // Store user data from Google (Mocked for social login demo)
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
        toast.error('Google login failed');
      }
    },
    onError: () => toast.error('Google login failed'),
  });

  // Facebook Login
  function handleFacebookLogin() {
    if (!window.FB) {
      toast.error('Facebook login is currently unavailable');
      return;
    }
    window.FB.login(response => {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name,email' }, userData => {
          toast.success(`Welcome ${userData.name}! Signed in with Facebook`);
          const mockToken = btoa(JSON.stringify({ id: userData.id, email: userData.email }));
          localStorage.setItem('userToken', mockToken);
          localStorage.setItem('userName', userData.name);
          dispatch(setUser({ token: mockToken, name: userData.name }));
          navigate('/');
        });
      } else {
        toast.error('Facebook login failed');
      }
    }, { scope: 'email' });
  }

  return (
    <div className="auth-page d-flex align-items-center" style={{ minHeight: '90vh', background: '#f8fafc' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="auth-card card border-0 shadow-lg" style={{ borderRadius: '30px' }}>
              <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-5">
                  <h2 className="fw-bold mb-1 display-5">
                    <span style={{ color: '#1a1a2e' }}>Fresh</span>
                    <span style={{ color: '#0aad0a' }}>Cart</span>
                  </h2>
                  <h3 className="fw-bold mt-4" style={{ color: '#1a1a2e' }}>Welcome Back! 👋</h3>
                  <p className="text-muted">Sign in to continue your fresh journey</p>
                </div>

                {/* Social Auth */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <button
                      className="btn btn-google w-100 d-flex align-items-center justify-content-center gap-2 py-3 shadow-sm border"
                      onClick={() => googleLogin()}
                      type="button"
                      style={{ borderRadius: '15px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="fw-bold">Google</span>
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      className="btn btn-facebook w-100 d-flex align-items-center justify-content-center gap-2 py-3 shadow-sm border-0"
                      onClick={handleFacebookLogin}
                      type="button"
                      style={{ borderRadius: '15px' }}
                    >
                      <i className="fab fa-facebook-f"></i>
                      <span className="fw-bold">Facebook</span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider-text text-center mb-4">
                  <span className="text-muted px-4 small fw-bold" style={{ background: 'white', position: 'relative', zIndex: 1 }}>
                    OR EMAIL
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                  {error && (
                    <div className="alert alert-danger rounded-4 py-3 border-0" style={{ fontSize: '0.9rem', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                      <i className="fas fa-exclamation-circle me-2"></i>{error}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-bold text-dark mb-2">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 px-3">
                        <i className="fas fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control bg-light border-0 shadow-none py-3 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                        placeholder="example@email.com"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback ps-2">{formik.errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="form-label fw-bold text-dark mb-0">Password</label>
                      <Link to="/forgot-password" className="text-success text-decoration-none small fw-bold">Forgot Password?</Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 px-3">
                        <i className="fas fa-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        className={`form-control bg-light border-0 shadow-none py-3 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback ps-2">{formik.errors.password}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm mt-2 transition-200"
                    disabled={loading}
                    style={{ backgroundColor: '#0aad0a', border: 'none' }}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
                    ) : (
                      <><i className="fas fa-right-to-bracket me-2"></i>Sign In</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-5 text-muted fw-bold">
                  New to FreshCart?{' '}
                  <Link to="/register" className="text-success text-decoration-none">Create Account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .btn-google { color: #555; transition: all 0.3s ease; }
        .btn-google:hover { background-color: #f8fafc !important; transform: translateY(-2px); }
        .btn-facebook { background-color: #1877F2; color: white !important; transition: all 0.3s ease; }
        .btn-facebook:hover { background-color: #166fe5 !important; transform: translateY(-2px); }
        .divider-text::before { content: ""; position: absolute; width: 100%; height: 1px; background: #f1f5f9; top: 50%; left: 0; }
        .input-group-text { border-top-left-radius: 15px !important; border-bottom-left-radius: 15px !important; }
        .transition-200 { transition: all 0.2s ease; }
        .transition-200:hover { opacity: 0.9; transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
