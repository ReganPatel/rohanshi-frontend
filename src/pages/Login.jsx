import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [newsletterOptIn, setNewsletterOptIn] = useState(true)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [otp, setOtp] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        if (!agreedToTerms) {
          toast.error("You must agree to the Terms of Service and Privacy Policy to create an account.");
          return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('newsletterOptIn', newsletterOptIn);
        if (profilePhoto) {
          formData.append('image', profilePhoto);
        }

        const response = await axios.post(backendUrl + '/api/user/register', formData)

        if (response.data.success || response.data.pendingVerification) {
          toast.success(response.data.message);
          if (response.data.pendingVerification) {
            setCurrentState('OTP'); // Switch to OTP View
          } else if (response.data.token) {
            // Fallback just in case old flow triggers
            setToken(response.data.token)
            sessionStorage.setItem('token', response.data.token)
          }
        } else {
          toast.error(response.data.message)
        }

      } else if (currentState === 'OTP') {
        const response = await axios.post(backendUrl + '/api/user/verify-otp', { email, otp });
        if (response.data.success) {
          toast.success(response.data.message);
          setToken(response.data.token);
          sessionStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Forgot Password') {
        const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Reset Password');
        } else {
          toast.error(response.data.message);
        }

      } else if (currentState === 'Reset Password') {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        const response = await axios.post(backendUrl + '/api/user/reset-password', { email, otp, newPassword: password });
        if (response.data.success) {
          toast.success(response.data.message);
          setCurrentState('Login');
          setPassword('');
          setConfirmPassword('');
          setOtp('');
        } else {
          toast.error(response.data.message);
        }
      } else {

        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          sessionStorage.setItem('token', response.data.token)
        } else {
          toast.error(response.data.message)
        }

      }


    } catch (error) {
      toast.error(error.message)
    }
  }

  const resendOtpHandler = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/user/resend-otp', { email });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4 py-10 sm:py-20 relative overflow-hidden'>
      {/* Background Decorative Elements */}
      <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10 animate-pulse'></div>
      <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] -z-10'></div>

      <div className='w-full max-w-lg transition-all duration-700 ease-out translate-y-0 opacity-100'>
        <form onSubmit={onSubmitHandler} className='glass-card p-6 sm:p-14 rounded-[2rem] sm:rounded-[3.5rem] border border-white/5 gold-glow relative overflow-hidden'>
          {/* Subtle Corner Accents */}
          <div className='absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl'></div>

          <div className='text-center mb-8 sm:mb-12 relative'>
            <div className='inline-flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
              <span className='w-6 sm:w-8 h-[1px] bg-secondary/50'></span>
              <p className='text-[8px] sm:text-[10px] font-outfit font-bold text-secondary tracking-[0.3em] sm:tracking-[0.5em] uppercase'>
                {currentState === 'Login' ? 'Sign In' : (currentState === 'Sign Up' ? 'Create Account' : (currentState === 'Forgot Password' ? 'Reset Password' : 'Verify OTP'))}
              </p>
              <span className='w-6 sm:w-8 h-[1px] bg-secondary/50'></span>
            </div>
            <h2 className='text-3xl sm:text-4xl font-outfit font-bold text-white tracking-tighter uppercase mb-2'>
              {currentState === 'OTP' ? 'Verify OTP' : (currentState === 'Login' ? 'Welcome Back' : (currentState === 'Sign Up' ? 'Join Us' : currentState))}
            </h2>
            <div className='w-10 sm:w-12 h-0.5 sm:h-1 bg-secondary mx-auto rounded-full mt-3 sm:mt-4'></div>
          </div>

          <div className='flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10'>
            {currentState === 'OTP' ? (
              <div className='flex flex-col gap-4 sm:gap-6 animate-fadeIn'>
                <p className='text-[10px] sm:text-[11px] text-gray-500 text-center font-outfit uppercase tracking-widest leading-loose'>
                  A verification code has been sent to<br />
                  <span className='text-white font-bold flex items-center justify-center gap-2 sm:gap-3 mt-2 bg-white/5 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full w-fit mx-auto border border-white/5'>
                    {email}
                    <button type="button" onClick={() => setCurrentState('Sign Up')} className='text-[8px] sm:text-[9px] text-secondary hover:text-white transition-colors tracking-widest uppercase border-l border-white/10 pl-2 sm:pl-3'>Change</button>
                  </span>
                </p>
                <div className='relative group'>
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    type="text"
                    maxLength="6"
                    className='w-full h-16 sm:h-20 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-center text-2xl sm:text-3xl font-bold tracking-[0.6em] sm:tracking-[0.8em] text-white outline-none focus:border-secondary transition-all placeholder:text-gray-800'
                    placeholder='••••••'
                    required
                  />
                  <div className='absolute inset-0 rounded-xl sm:rounded-2xl border border-secondary/0 group-focus-within:border-secondary/30 pointer-events-none transition-all duration-500'></div>
                </div>
              </div>
            ) : currentState === 'Forgot Password' ? (
              <div className='flex flex-col gap-4 sm:gap-6 animate-fadeIn'>
                <p className='text-[10px] sm:text-[11px] text-gray-500 text-center font-outfit uppercase tracking-widest mb-1 sm:mb-2'>Enter your email to reset your password</p>
                <div className='relative group'>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    className='w-full h-14 sm:h-16 px-6 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit font-bold tracking-[0.1em] outline-none focus:border-secondary transition-all placeholder:text-gray-600 text-xs sm:text-sm'
                    placeholder='EMAIL ADDRESS'
                    required
                  />
                  <div className='absolute inset-0 rounded-xl sm:rounded-2xl border border-secondary/0 group-focus-within:border-secondary/30 pointer-events-none transition-all duration-500'></div>
                </div>
              </div>
            ) : currentState === 'Reset Password' ? (
              <div className='flex flex-col gap-4 sm:gap-6 animate-fadeIn'>
                <p className='text-[10px] sm:text-[11px] text-gray-500 text-center font-outfit uppercase tracking-widest mb-1 sm:mb-2'>Create your new password for <span className='text-white'>{email}</span></p>
                <input onChange={(e) => setOtp(e.target.value)} value={otp} type="text" maxLength="6" className='h-14 sm:h-16 px-6 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-center text-lg sm:text-xl font-bold tracking-[0.4em] sm:tracking-[0.5em] text-white focus:border-secondary outline-none transition-all text-xs sm:text-sm' placeholder='OTP CODE' required />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='h-14 sm:h-16 px-6 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit font-bold focus:border-secondary outline-none transition-all text-xs sm:text-sm' placeholder='NEW PASSWORD' required />
                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className='h-14 sm:h-16 px-6 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit font-bold focus:border-secondary outline-none transition-all text-xs sm:text-sm' placeholder='CONFIRM PASSWORD' required />
              </div>
            ) : (
              <div className='flex flex-col gap-4 sm:gap-6'>
                {currentState === 'Sign Up' && (
                  <div className='flex flex-col items-center gap-3 sm:gap-4 mb-2 sm:mb-4 animate-fadeIn'>
                    <label htmlFor="profilePhoto" className='cursor-pointer group'>
                      <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden bg-white/5 group-hover:bg-secondary/10 group-hover:border-secondary/30 transition-all relative'>
                        {profilePhoto ? (
                          <img src={URL.createObjectURL(profilePhoto)} className='w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700' alt="Profile Preview" />
                        ) : (
                          <div className='flex flex-col items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity'>
                            <svg className="w-6 sm:w-8 h-6 sm:h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <p className='text-[7px] sm:text-[8px] font-outfit font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase'>Upload Photo</p>
                          </div>
                        )}
                        <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                          <p className='text-white text-[8px] sm:text-[9px] font-outfit font-bold tracking-[0.2em]'>CHANGE PHOTO</p>
                        </div>
                      </div>
                    </label>
                    <input onChange={(e) => setProfilePhoto(e.target.files[0])} type="file" id="profilePhoto" hidden accept="image/*" />
                    <p className='text-[8px] sm:text-[9px] font-outfit font-bold text-gray-500 uppercase tracking-widest'>Profile Photo (Optional)</p>
                  </div>
                )}

                {currentState === 'Sign Up' && (
                  <div className='relative group'>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full h-14 sm:h-16 px-6 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit font-bold tracking-[0.1em] outline-none focus:border-secondary transition-all placeholder:text-gray-600 text-xs sm:text-sm' placeholder='FULL NAME' required />
                    <div className='absolute inset-0 rounded-xl sm:rounded-2xl border border-secondary/0 group-focus-within:border-secondary/30 pointer-events-none transition-all duration-500'></div>
                  </div>
                )}

                <div className='relative group'>
                  <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full h-14 sm:h-16 px-6 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit font-bold tracking-[0.1em] outline-none focus:border-secondary transition-all placeholder:text-gray-600 text-xs sm:text-sm' placeholder='EMAIL ADDRESS' required />
                  <div className='absolute inset-0 rounded-xl sm:rounded-2xl border border-secondary/0 group-focus-within:border-secondary/30 pointer-events-none transition-all duration-500'></div>
                </div>

                <div className='relative group'>
                  <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full h-14 sm:h-16 px-6 sm:px-8 bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl text-white font-outfit font-bold tracking-[0.1em] outline-none focus:border-secondary transition-all placeholder:text-gray-600 text-xs sm:text-sm' placeholder='PASSWORD' required />
                  <div className='absolute inset-0 rounded-xl sm:rounded-2xl border border-secondary/0 group-focus-within:border-secondary/30 pointer-events-none transition-all duration-500'></div>
                </div>
              </div>
            )}
          </div>

          {currentState === 'Sign Up' && (
            <div className='w-full flex flex-col gap-4 text-xs mt-2 mb-10'>
              <label className='flex items-start gap-4 cursor-pointer group'>
                <div className='relative flex items-center mt-0.5'>
                  <input
                    type="checkbox"
                    className='w-5 h-5 appearance-none bg-black/40 border border-white/10 rounded-lg checked:border-secondary/50 checked:bg-secondary/20 transition-all cursor-pointer'
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    required
                  />
                  <div className={`absolute inset-0 flex items-center justify-center text-secondary pointer-events-none transition-opacity duration-300 ${agreedToTerms ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <span className='text-[10px] text-gray-400 font-outfit uppercase tracking-widest leading-relaxed group-hover:text-gray-300 transition-colors'>
                  I accept the <Link to='/terms-of-service' target='_blank' className='text-secondary font-bold hover:underline'>Terms of Service</Link> & <Link to='/privacy-policy' target='_blank' className='text-secondary font-bold hover:underline'>Privacy Policy</Link>.
                </span>
              </label>

              <label className='flex items-start gap-4 cursor-pointer group'>
                <div className='relative flex items-center mt-0.5'>
                  <input
                    type="checkbox"
                    className='w-5 h-5 appearance-none bg-black/40 border border-white/10 rounded-lg checked:border-secondary/50 checked:bg-secondary/20 transition-all cursor-pointer'
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                  />
                  <div className={`absolute inset-0 flex items-center justify-center text-secondary pointer-events-none transition-opacity duration-300 ${newsletterOptIn ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                </div>
                <span className='text-[10px] text-gray-400 font-outfit uppercase tracking-widest leading-relaxed group-hover:text-gray-300 transition-colors'>
                  Subscribe to our newsletter for exclusive offers and updates.
                </span>
              </label>
            </div>
          )}

          <div className='w-full flex items-center justify-between mt-4 mb-2'>
            {currentState === 'OTP' || currentState === 'Reset Password' ? (
              <p onClick={resendOtpHandler} className='cursor-pointer text-[10px] font-outfit font-bold text-secondary uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-secondary/20 pb-1'>RESEND OTP</p>
            ) : currentState === 'Forgot Password' ? (
              <div></div>
            ) : (
              <p onClick={() => setCurrentState('Forgot Password')} className='cursor-pointer text-[9px] font-outfit font-bold text-gray-500 uppercase tracking-widest hover:text-secondary transition-colors'>Forgot password?</p>
            )}

            <div className='flex flex-col items-end'>
              {currentState === 'Login' ? (
                <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer text-[10px] font-outfit font-bold text-secondary uppercase tracking-[0.2em] hover:text-white transition-colors group'>
                  Create account <span className='inline-block transition-transform group-hover:translate-x-1 ml-1'>→</span>
                </p>
              ) : currentState === 'Sign Up' ? (
                <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-[10px] font-outfit font-bold text-secondary uppercase tracking-[0.2em] hover:text-white transition-colors group'>
                  Back to login <span className='inline-block transition-transform group-hover:translate-x-1 ml-1'>→</span>
                </p>
              ) : (
                <p onClick={() => { setCurrentState('Login'); setPassword(''); setConfirmPassword(''); setOtp(''); }} className='cursor-pointer text-[10px] font-outfit font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors'>
                  Back to Login
                </p>
              )}
            </div>
          </div>

          <button className='w-full py-5 sm:py-6 mt-8 sm:mt-10 bg-white text-black font-outfit font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] rounded-2xl sm:rounded-3xl hover:bg-secondary transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-secondary/20 relative overflow-hidden group'>
            <span className='relative z-10'>
              {currentState === 'Login' ? 'SIGN IN' : (currentState === 'Sign Up' ? 'START NOW' : (currentState === 'Forgot Password' ? 'SEND OTP' : (currentState === 'Reset Password' ? 'RESET PASSWORD' : 'VERIFY CODE')))}
            </span>
            <div className='absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500'></div>
          </button>

          <p className='text-center mt-6 sm:mt-8 text-[8px] sm:text-[9px] text-gray-600 font-outfit uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-60 px-4'>Excellence in Authenticity Guaranteed</p>
        </form>
      </div>
    </div>
  )
}

export default Login