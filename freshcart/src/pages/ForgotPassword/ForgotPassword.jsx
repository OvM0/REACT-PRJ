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
      email: Yup.string().email('بريد إلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(forgotPassword(values.email)).unwrap();
        setEmail(values.email);
        toast.success('تم إرسال رمز التحقق لبريدك الإلكتروني');
        setStep(2);
      } catch (err) {
        toast.error(err || 'حدث خطأ');
      }
    },
  });

  // Step 2 - Verify Code
  const codeFormik = useFormik({
    initialValues: { resetCode: '' },
    validationSchema: Yup.object({
      resetCode: Yup.string().length(6, 'الرمز يجب أن يكون 6 أرقام').required('رمز التحقق مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(verifyResetCode(values.resetCode)).unwrap();
        toast.success('تم التحقق من الرمز');
        setStep(3);
      } catch (err) {
        toast.error(err || 'رمز غير صحيح');
      }
    },
  });

  // Step 3 - New Password
  const passwordFormik = useFormik({
    initialValues: { newPassword: '', confirmPassword: '' },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(6, 'كلمة المرور على الأقل 6 أحرف').required('كلمة المرور مطلوبة'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'كلمتا المرور غير متطابقتين')
        .required('تأكيد كلمة المرور مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(resetPassword({ email, newPassword: values.newPassword })).unwrap();
        toast.success('تم تغيير كلمة المرور بنجاح!');
        navigate('/');
      } catch (err) {
        toast.error(err || 'حدث خطأ');
      }
    },
  });

  const steps = [
    { num: 1, label: 'البريد الإلكتروني' },
    { num: 2, label: 'رمز التحقق' },
    { num: 3, label: 'كلمة المرور' },
  ];

  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #f0fdf0, #e8f5e9)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '24px' }}>
              <div className="card-body p-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <div className="step-icon mb-3">
                    <i className={`fas ${step === 1 ? 'fa-envelope' : step === 2 ? 'fa-key' : 'fa-lock'} fa-2x text-success`}></i>
                  </div>
                  <h4 className="fw-bold" style={{ color: '#1a1a2e' }}>
                    {step === 1 && 'نسيت كلمة المرور؟'}
                    {step === 2 && 'التحقق من الهوية'}
                    {step === 3 && 'كلمة مرور جديدة'}
                  </h4>
                  <p className="text-muted small">
                    {step === 1 && 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق'}
                    {step === 2 && `أدخل الرمز المرسل إلى ${email}`}
                    {step === 3 && 'اختر كلمة مرور جديدة وقوية'}
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                  {steps.map((s, i) => (
                    <React.Fragment key={s.num}>
                      <div className="text-center">
                        <div className={`step-circle ${step >= s.num ? 'active' : ''}`}>
                          {step > s.num ? <i className="fas fa-check"></i> : s.num}
                        </div>
                        <small className={`d-block mt-1 ${step === s.num ? 'text-success fw-bold' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                          {s.label}
                        </small>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="step-line" style={{ background: step > s.num ? '#0aad0a' : '#e9ecef' }}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Step 1 */}
                {step === 1 && (
                  <form onSubmit={emailFormik.handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">البريد الإلكتروني</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                          <i className="fas fa-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control shadow-none border-start-0 ${emailFormik.touched.email && emailFormik.errors.email ? 'is-invalid' : ''}`}
                          placeholder="example@email.com"
                          name="email"
                          value={emailFormik.values.email}
                          onChange={emailFormik.handleChange}
                          onBlur={emailFormik.handleBlur}
                          style={{ borderRadius: '0 12px 12px 0' }}
                        />
                        {emailFormik.touched.email && emailFormik.errors.email && (
                          <div className="invalid-feedback">{emailFormik.errors.email}</div>
                        )}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-pill py-3 fw-bold" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-paper-plane me-2"></i>}
                      {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
                    </button>
                  </form>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <form onSubmit={codeFormik.handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">رمز التحقق (6 أرقام)</label>
                      <input
                        type="text"
                        className={`form-control shadow-none text-center fw-bold fs-4 letter-spacing ${codeFormik.touched.resetCode && codeFormik.errors.resetCode ? 'is-invalid' : ''}`}
                        placeholder="000000"
                        maxLength={6}
                        name="resetCode"
                        value={codeFormik.values.resetCode}
                        onChange={codeFormik.handleChange}
                        onBlur={codeFormik.handleBlur}
                        style={{ borderRadius: '12px', letterSpacing: '8px' }}
                      />
                      {codeFormik.touched.resetCode && codeFormik.errors.resetCode && (
                        <div className="invalid-feedback text-center">{codeFormik.errors.resetCode}</div>
                      )}
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-pill py-3 fw-bold mb-3" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-check me-2"></i>}
                      {loading ? 'جاري التحقق...' : 'تحقق من الرمز'}
                    </button>
                    <button type="button" className="btn btn-link text-success w-100" onClick={() => setStep(1)}>
                      <i className="fas fa-arrow-right me-2"></i>تغيير البريد الإلكتروني
                    </button>
                  </form>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <form onSubmit={passwordFormik.handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">كلمة المرور الجديدة</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className={`form-control shadow-none border-start-0 ${passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? 'is-invalid' : ''}`}
                          placeholder="••••••••"
                          name="newPassword"
                          value={passwordFormik.values.newPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          style={{ borderRadius: '0 12px 12px 0' }}
                        />
                        {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                          <div className="invalid-feedback">{passwordFormik.errors.newPassword}</div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">تأكيد كلمة المرور</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                          <i className="fas fa-lock text-muted"></i>
                        </span>
                        <input
                          type="password"
                          className={`form-control shadow-none border-start-0 ${passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? 'is-invalid' : ''}`}
                          placeholder="••••••••"
                          name="confirmPassword"
                          value={passwordFormik.values.confirmPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          style={{ borderRadius: '0 12px 12px 0' }}
                        />
                        {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                          <div className="invalid-feedback">{passwordFormik.errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-pill py-3 fw-bold" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-key me-2"></i>}
                      {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
                    </button>
                  </form>
                )}

                <div className="text-center mt-3">
                  <Link to="/login" className="text-muted text-decoration-none small">
                    <i className="fas fa-arrow-right me-1"></i>العودة لتسجيل الدخول
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .step-icon {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: #f0fdf0;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto;
        }
        .step-circle {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #e9ecef;
          color: #636e72;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.9rem;
          transition: all 0.3s;
        }
        .step-circle.active { background: #0aad0a; color: white; box-shadow: 0 4px 12px rgba(10,173,10,0.3); }
        .step-line {
          height: 3px; width: 40px;
          border-radius: 2px;
          transition: background 0.3s;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
