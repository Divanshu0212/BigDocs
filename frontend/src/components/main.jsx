import React, { useState, useEffect } from "react";
import { Bell, Calendar, MessageSquare, Heart, Activity, Brain, Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase"; // Import Firebase authentication
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Track user authentication state
  const [role, setRole] = useState(null); // Track user role
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user role from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setRole(userSnap.data().role); // Assuming 'role' field is stored in Firestore
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleHomeClick = () => {
    if (!user) {
      navigate("/login");
    } else if (role === "doctor") {
      navigate("/doctor-dashboard");
    } else if (role === "patient") {
      navigate("/patient-dashboard");
    } else {
      navigate("/"); // Fallback
    }
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">BigDocs</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={handleHomeClick} className="text-gray-600 hover:text-blue-600">
              Home
            </button>
            <Link to="/symptom" className="text-gray-600 hover:text-blue-600">AI Symptom Checker</Link>
            <Link to="/community" className="text-gray-600 hover:text-blue-600">Community</Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4">
          <div className="flex flex-col space-y-4">
            <button onClick={handleHomeClick} className="text-gray-600 hover:text-blue-600">
              Home
            </button>
            <Link to="/symptom" className="text-gray-600 hover:text-blue-600">AI Symptom Checker</Link>
            <Link to="/community" className="text-gray-600 hover:text-blue-600">Community</Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


export const Hero = () => (
  <div className="pt-50 h-full pb-16"
    style={{
      backgroundImage: `url('/hero-image.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          Your Health, Our Priority
        </h1>
        <p className="mt-3 text-xl text-blue-100 sm:mt-5">
          Access world-class healthcare from the comfort of your home
        </p>
        <div className="mt-8 flex justify-center">
          <div className="rounded-md shadow">
            <Link to="/login">
              <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Features = () => (
  <div className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Our Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
          title="24/7 Chat Support"
          description="Connect with healthcare professionals anytime, anywhere through our secure messaging platform."
        />
        <FeatureCard
          icon={<Calendar className="h-8 w-8 text-blue-600" />}
          title="Easy Scheduling"
          description="Book appointments with top doctors and specialists with just a few clicks."
        />
        <FeatureCard
          icon={<Activity className="h-8 w-8 text-blue-600" />}
          title="Health Tracking"
          description="Monitor your vital signs and health metrics with our advanced tracking system."
        />
        <FeatureCard
          icon={<Heart className="h-8 w-8 text-blue-600" />}
          title="Wellness Programs"
          description="Personalized wellness programs designed to help you achieve your health goals."
        />
        <FeatureCard
          icon={<Brain className="h-8 w-8 text-blue-600" />}
          title="Mental Health"
          description="Access mental health resources and connect with professional therapists."
        />
        <FeatureCard
          icon={<Bell className="h-8 w-8 text-blue-600" />}
          title="Medication Reminders"
          description="Never miss a dose with our smart medication reminder system."
        />
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

export const SearchSection = () => (
  <div className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-blue-600 rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Find the Right Doctor
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by specialty, doctor, or condition"
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <button className="px-8 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">BigDocs</h3>
          <p className="text-gray-400">Your trusted healthcare partner</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Telemedicine</li>
            <li>Health Tracking</li>
            <li>Mental Health</li>
            <li>Wellness Programs</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2025 BigDocs. All rights reserved.</p>
      </div>
    </div>
  </footer>
) 