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
      name: Yup.string().min(3, 'Name must be at least 3 characters').max(32, 'Name is too long').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/^(?=.*[A-Z])(?=.*\d)/, 'Must contain at least one uppercase letter and one number')
        .required('Password is required'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Confirm password is required'),
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, 'Enter a valid Egyptian phone number')
        .required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(registerUser(values)).unwrap();
        toast.success('Account created successfully!');
        navigate('/');
      } catch (err) {
        toast.error(err || 'Registration failed');
      }
    },
  });

  const fields = [
    { name: 'name', label: 'Full Name', icon: 'fa-user', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', icon: 'fa-envelope', type: 'email', placeholder: 'example@email.com' },
    { name: 'phone', label: 'Phone Number', icon: 'fa-phone', type: 'tel', placeholder: '01xxxxxxxxx' },
    { name: 'password', label: 'Password', icon: 'fa-lock', type: 'password', placeholder: '••••••••' },
    { name: 'rePassword', label: 'Confirm Password', icon: 'fa-lock', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="auth-page d-flex align-items-center py-5" style={{ minHeight: '90vh', background: '#f8fafc' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '30px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <h2 className="fw-bold mb-1 display-5">
                    <span style={{ color: '#1a1a2e' }}>Fresh</span>
                    <span style={{ color: '#0aad0a' }}>Cart</span>
                  </h2>
                  <h3 className="fw-bold mt-4" style={{ color: '#1a1a2e' }}>Create Account 🎉</h3>
                  <p className="text-muted">Join the fresh family and start shopping</p>
                </div>

                {error && (
                  <div className="alert alert-danger rounded-4 py-3 border-0 mb-4" style={{ fontSize: '0.9rem', backgroundColor: '#fef2f2', color: '#dc2626' }}>
                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                  <div className="row g-4">
                    {fields.map(field => (
                      <div key={field.name} className="col-12">
                        <label className="form-label fw-bold text-dark mb-2">{field.label}</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0 px-3" style={{ borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px' }}>
                            <i className={`fas ${field.icon} text-muted`}></i>
                          </span>
                          <input
                            type={field.type}
                            className={`form-control bg-light border-0 shadow-none py-3 ${formik.touched[field.name] && formik.errors[field.name] ? 'is-invalid' : ''}`}
                            placeholder={field.placeholder}
                            name={field.name}
                            value={formik.values[field.name]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            style={{ borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
                          />
                          {formik.touched[field.name] && formik.errors[field.name] && (
                            <div className="invalid-feedback ps-2">{formik.errors[field.name]}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 rounded-pill py-3 fw-bold fs-5 mt-5 shadow-sm transition-200"
                    disabled={loading || !formik.isValid || !formik.dirty}
                    style={{ backgroundColor: '#0aad0a', border: 'none' }}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
                    ) : (
                      <><i className="fas fa-user-plus me-2"></i>Create Account</>
                    )}
                  </button>
                </form>

                <p className="text-center mt-5 text-muted fw-bold">
                  Already have an account?{' '}
                  <Link to="/login" className="text-success text-decoration-none">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .transition-200 { transition: all 0.2s ease; }
        .transition-200:hover { opacity: 0.9; transform: translateY(-2px); }
        .form-label { font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
