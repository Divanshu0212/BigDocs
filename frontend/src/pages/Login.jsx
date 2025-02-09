import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a user is already signed in
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await handleNavigation(user);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleNavigation = async (user) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                navigate(userData.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
            } else {
                setError('User role not found. Please contact support.');
            }
        } catch (err) {
            console.error('Error fetching user role:', err);
            setError('An error occurred while fetching user data.');
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await handleNavigation(userCredential.user);
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(err);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Reference to the Firestore user document
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                // If the user doesn't exist, create a new record with a default role and address
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    role: 'patient',  // Default role
                    address: 'NA',    // Default address
                    name: user.displayName || '',
                    createdAt: new Date().toISOString()
                });
            }

            await handleNavigation(user);
        } catch (err) {
            setError('Failed to sign in with Google.');
            console.error(err);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-bold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleEmailLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsResetModalOpen(true)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
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
                                onClick={handleGoogleLogin}
                                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                Sign in with Google
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
