import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (location.state && location.state.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: '',
            password: '',
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        
        if (validateForm()) {
            setIsLoading(true);
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', 
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }
                
                console.log('Login successful:', data);
                
                login(data.user);
                
                navigate('/');
                
            } catch (error) {
                console.error('Login error:', error);
                setApiError(error instanceof Error ? error.message : 'Login failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex h-screen login-page">
            {/* Left Column - Login Form */}
            <div className="w-1/2 flex items-center justify-center mt-20 mb-20">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <Link to="/" className="text-white">
                            <span className='hover:bg-white hover:text-black border border-white rounded p-2'>←</span>
                        </Link>
                    </div>
                    
                    <h1 className="text-4xl font-bold mb-2 text-white">Sign In</h1>
                    <p className="text-white mb-8">Welcome back to Local Store</p>

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {successMessage}
                        </div>
                    )}

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <div className="relative">
                                <input
                                    type="email"
                                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#1F7D53] text-white bg-transparent`}
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                                    disabled={isLoading}
                                />
                                {formData.email && !errors.email && (
                                    <span className="absolute right-3 top-3 text-green-500">✓</span>
                                )}
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#1F7D53] text-white bg-transparent`}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                                    disabled={isLoading}
                                />
                                <button 
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-3 cursor-pointer"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEyeSlash : faEye} 
                                        className="text-white hover:text-gray-300 transition-colors duration-200" 
                                    />
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-[#1F7D53] hover:underline text-sm">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-[#1F7D53] text-white py-3 rounded-lg hover:bg-[#255F38] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                            <div className="mt-4 text-center text-white">
                                Or
                            </div>
                            <div className="mt-4 flex space-x-4">
                                <button 
                                    type="button"
                                    className="flex-1 py-3 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 group"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 mx-auto text-white group-hover:text-black" />
                                </button>   
                                <button 
                                    type="button"
                                    className="flex-1 py-3 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 group"
                                    disabled={isLoading}
                                >
                                    <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 mx-auto text-white group-hover:text-black" />
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-white">
                        Don't have an account? {' '}
                        <Link to="/signup" className="text-[#1F7D53] hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                    <p className="text-lg">Sign in to continue shopping</p>
                </div>
            </div>
        </div>
    );
}

export default Login;