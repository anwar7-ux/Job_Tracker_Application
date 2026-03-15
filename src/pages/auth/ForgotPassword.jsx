import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosApi from '../../api/axios'
import './Auth.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // STEP 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await axiosApi.post('/auth/forgot-password/send-otp', { email })
      toast.success('OTP sent to your email!')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // STEP 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) { toast.error('Please enter OTP'); return }
    setLoading(true)
    try {
      await axiosApi.post('/auth/forgot-password/verify-otp', { email, otp })
      toast.success('OTP verified!')
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  // STEP 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) { toast.error('Please fill all fields'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await axiosApi.post('/auth/forgot-password/reset-password', { email, newPassword })
      toast.success('Password reset successfully! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo-fallback">JT</div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: 32, height: 4, borderRadius: 2,
              background: s <= step ? 'var(--brand)' : 'var(--gray-200)'
            }} />
          ))}
        </div>

        <h1 className="auth-title">
          {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
        </h1>
        <p className="auth-sub">
          {step === 1 ? 'Enter your registered email' :
           step === 2 ? `OTP sent to ${email}` :
           'Enter your new password'}
        </p>

        <div className="auth-form">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="input-group">
                <label>OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                />
              </div>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center' }}>
                Didn't receive?{' '}
                <span
                  style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}
                  onClick={handleSendOtp}
                >
                  Resend OTP
                </span>
              </p>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleResetPassword()}
                />
              </div>
            </>
          )}

          <button
            className="auth-btn"
            onClick={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Please wait…' :
             step === 1 ? 'Send OTP' :
             step === 2 ? 'Verify OTP' :
             'Reset Password'}
          </button>
        </div>

        <p className="auth-footer-text">
          Remember password?{' '}
          <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  )
}