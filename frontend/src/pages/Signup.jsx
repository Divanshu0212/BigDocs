import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !isGoogleFlow) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          navigate(userData.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, isGoogleFlow]);

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!role) {
      return setError('Please select a role');
    }

    if (!address.trim()) {
      return setError('Please enter your address');
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
        fullName: fullName,
        address: address,
        createdAt: new Date().toISOString()
      });

      navigate(role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    } catch (err) {
      setError('Failed to create an account.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setGoogleUser(result.user);
      setIsGoogleFlow(true);
      setEmail(result.user.email);
      setFullName(result.user.displayName || '');
    } catch (err) {
      setError('Google signup failed.');
      console.error(err);
    }
  };

  const handleGoogleFlowSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      return setError('Please select a role');
    }

    if (!address.trim()) {
      return setError('Please enter your address');
    }

    setLoading(true);
    setError('');

    try {
      await setDoc(doc(db, 'users', googleUser.uid), {
        email: googleUser.email,
        role: role,
        fullName: fullName,
        address: address,
        createdAt: new Date().toISOString()
      });

      navigate(role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    } catch (err) {
      setError('Failed to complete signup.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {!isGoogleFlow ? (
            <>
              <form onSubmit={handleEmailSignup} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    I am a
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('doctor')}
                      className={`py-2 px-4 border rounded-md text-sm font-medium
                        ${role === 'doctor' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                    >
                      Doctor
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('patient')}
                      className={`py-2 px-4 border rounded-md text-sm font-medium
                        ${role === 'patient' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                    >
                      Patient
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Creating account...' : 'Sign up'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleGoogleSignup}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleGoogleFlowSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  disabled
                  className="w-full px-3 py-2 border rounded-md shadow-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  I am a
                </label>
                <div className="mt-1 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`py-2 px-4 border rounded-md text-sm font-medium
                      ${role === 'doctor' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                  >
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`py-2 px-4 border rounded-md text-sm font-medium
                      ${role === 'patient' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                  >
                    Patient
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Completing signup...' : 'Complete signup'}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;