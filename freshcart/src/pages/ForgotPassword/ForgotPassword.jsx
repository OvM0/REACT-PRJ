import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forgotPassword, verifyResetCode, resetPassword } from '../../store/authSlice';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState('');

  // Step 1 - Email
  const emailFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(forgotPassword(values.email)).unwrap();
        setEmail(values.email);
        toast.success('Verification code sent to your email');
        setStep(2);
      } catch (err) {
        toast.error(err || 'Something went wrong');
      }
    },
  });

  // Step 2 - Verify Code
  const codeFormik = useFormik({
    initialValues: { resetCode: '' },
    validationSchema: Yup.object({
      resetCode: Yup.string().length(6, 'Code must be exactly 6 digits').required('Verification code is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(verifyResetCode(values.resetCode)).unwrap();
        toast.success('Code verified successfully');
        setStep(3);
      } catch (err) {
        toast.error(err || 'Invalid verification code');
      }
    },
  });

  // Step 3 - New Password
  const passwordFormik = useFormik({
    initialValues: { newPassword: '', confirmPassword: '' },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(resetPassword({ email, newPassword: values.newPassword })).unwrap();
        toast.success('Password updated successfully!');
        navigate('/login');
      } catch (err) {
        toast.error(err || 'Failed to update password');
      }
    },
  });

  const steps = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Verify' },
    { num: 3, label: 'Reset' },
  ];

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh', background: '#f8fafc' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '30px' }}>
              <div className="card-body p-5">
                {/* Header Icon */}
                <div className="text-center mb-4">
                  <div className="step-icon mb-4">
                    <i className={`fas ${step === 1 ? 'fa-envelope' : step === 2 ? 'fa-key' : 'fa-lock'} fa-2x text-success`}></i>
                  </div>
                  <h3 className="fw-bold mb-2" style={{ color: '#1a1a2e' }}>
                    {step === 1 && 'Forgot Password?'}
                    {step === 2 && 'Verify Identity'}
                    {step === 3 && 'New Password'}
                  </h3>
                  <p className="text-muted small">
                    {step === 1 && 'Enter your email address to receive a recovery code'}
                    {step === 2 && `Enter the 6-digit code sent to ${email}`}
                    {step === 3 && 'Choose a strong and secure new password'}
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="d-flex align-items-center justify-content-center gap-2 mb-5">
                  {steps.map((s, i) => (
                    <React.Fragment key={s.num}>
                      <div className="text-center position-relative">
                        <div className={`step-circle shadow-sm ${step >= s.num ? 'active' : ''}`}>
                          {step > s.num ? <i className="fas fa-check"></i> : s.num}
                        </div>
                        <small className={`d-block mt-2 ${step === s.num ? 'text-success fw-bold' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                          {s.label}
                        </small>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="step-line" style={{ background: step > s.num ? '#0aad0a' : '#e2e8f0' }}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step Forms */}
                <div className="form-container mb-4">
                  {step === 1 && (
                    <form onSubmit={emailFormik.handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label fw-bold text-dark mb-2">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0 px-3" style={{ borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px' }}>
                            <i className="fas fa-envelope text-muted"></i>
                          </span>
                          <input
                            type="email"
                            className={`form-control bg-light border-0 shadow-none py-3 ${emailFormik.touched.email && emailFormik.errors.email ? 'is-invalid' : ''}`}
                            placeholder="example@email.com"
                            name="email"
                            value={emailFormik.values.email}
                            onChange={emailFormik.handleChange}
                            onBlur={emailFormik.handleBlur}
                            style={{ borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
                          />
                          {emailFormik.touched.email && emailFormik.errors.email && (
                            <div className="invalid-feedback ps-2">{emailFormik.errors.email}</div>
                          )}
                        </div>
                      </div>
                      <button type="submit" className="btn btn-success w-100 rounded-pill py-3 fw-bold transition-200" disabled={loading} style={{ backgroundColor: '#0aad0a', border: 'none' }}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-paper-plane me-2"></i>}
                        {loading ? 'Sending...' : 'Send Code'}
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <form onSubmit={codeFormik.handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label fw-bold text-dark mb-2 text-center d-block">6-Digit Code</label>
                        <input
                          type="text"
                          className={`form-control bg-light border-0 shadow-none text-center fw-bold fs-4 py-3 ${codeFormik.touched.resetCode && codeFormik.errors.resetCode ? 'is-invalid' : ''}`}
                          placeholder="000000"
                          maxLength={6}
                          name="resetCode"
                          value={codeFormik.values.resetCode}
                          onChange={codeFormik.handleChange}
                          onBlur={codeFormik.handleBlur}
                          style={{ borderRadius: '15px', letterSpacing: '8px' }}
                        />
                        {codeFormik.touched.resetCode && codeFormik.errors.resetCode && (
                          <div className="invalid-feedback text-center">{codeFormik.errors.resetCode}</div>
                        )}
                      </div>
                      <button type="submit" className="btn btn-success w-100 rounded-pill py-3 fw-bold mb-3 transition-200" disabled={loading} style={{ backgroundColor: '#0aad0a', border: 'none' }}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-check me-2"></i>}
                        {loading ? 'Verifying...' : 'Verify Code'}
                      </button>
                      <button type="button" className="btn btn-link text-success w-100 text-decoration-none small fw-bold" onClick={() => setStep(1)}>
                        <i className="fas fa-arrow-left me-2"></i>Use different email
                      </button>
                    </form>
                  )}

                  {step === 3 && (
                    <form onSubmit={passwordFormik.handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label fw-bold text-dark mb-2">New Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0 px-3" style={{ borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px' }}>
                            <i className="fas fa-lock text-muted"></i>
                          </span>
                          <input
                            type="password"
                            className={`form-control bg-light border-0 shadow-none py-3 ${passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? 'is-invalid' : ''}`}
                            placeholder="••••••••"
                            name="newPassword"
                            value={passwordFormik.values.newPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            style={{ borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
                          />
                          {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                            <div className="invalid-feedback ps-2">{passwordFormik.errors.newPassword}</div>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-bold text-dark mb-2">Confirm Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0 px-3" style={{ borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px' }}>
                            <i className="fas fa-lock text-muted"></i>
                          </span>
                          <input
                            type="password"
                            className={`form-control bg-light border-0 shadow-none py-3 ${passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? 'is-invalid' : ''}`}
                            placeholder="••••••••"
                            name="confirmPassword"
                            value={passwordFormik.values.confirmPassword}
                            onChange={passwordFormik.handleChange}
                            onBlur={passwordFormik.handleBlur}
                            style={{ borderTopRightRadius: '15px', borderBottomRightRadius: '15px' }}
                          />
                          {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                            <div className="invalid-feedback ps-2">{passwordFormik.errors.confirmPassword}</div>
                          )}
                        </div>
                      </div>
                      <button type="submit" className="btn btn-success w-100 rounded-pill py-3 fw-bold transition-200" disabled={loading} style={{ backgroundColor: '#0aad0a', border: 'none' }}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-key me-2"></i>}
                        {loading ? 'Saving...' : 'Reset Password'}
                      </button>
                    </form>
                  )}
                </div>

                <div className="text-center pt-3 border-top">
                  <Link to="/login" className="text-muted text-decoration-none small fw-bold">
                    <i className="fas fa-arrow-left me-2"></i>Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .step-icon {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: #f0fdf4;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto;
        }
        .step-circle {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: #fff;
          color: #64748b;
          border: 2px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
        }
        .step-circle.active { background: #0aad0a; color: white !important; border-color: #0aad0a; box-shadow: 0 4px 12px rgba(10,173,10,0.25); }
        .step-line {
          height: 3px; width: 60px;
          border-radius: 2px;
          margin-bottom: 24px;
          z-index: 1;
        }
        .transition-200 { transition: all 0.2s ease; }
        .transition-200:hover { opacity: 0.9; transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
