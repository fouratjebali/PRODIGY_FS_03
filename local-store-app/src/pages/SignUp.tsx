import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Login.css';

function SignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: ''
        };

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
            isValid = false;
        }

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // Terms validation
        if (!acceptTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle signup logic here
            console.log('Signup data:', formData);
        }
    };

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className="flex h-screen login-page">
            {/* Left Column - Sign Up Form */}
            <div className="w-1/2 flex items-center justify-center mt-20 mb-20">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <Link to="/" className="text-white">
                            <span className='hover:bg-white hover:text-black border border-white rounded p-2'>←</span>
                        </Link>
                    </div>
                    
                    <h1 className="text-4xl font-bold mb-2 text-white">Sign Up</h1>
                    <p className="text-white mb-8">Create your Local Store account</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#1F7D53] text-white bg-transparent`}
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
                                />
                                {formData.fullName && !errors.fullName && (
                                    <span className="absolute right-3 top-3 text-green-500">✓</span>
                                )}
                            </div>
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#1F7D53] text-white bg-transparent`}
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                                />
                                {formData.username && !errors.username && (
                                    <span className="absolute right-3 top-3 text-green-500">✓</span>
                                )}
                            </div>
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <div className="relative">
                                <input
                                    type="email"
                                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#1F7D53] text-white bg-transparent`}
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
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
                                />
                                <button 
                                    type="button"
                                    onClick={() => togglePasswordVisibility('password')}
                                    className="absolute right-3 top-3 cursor-pointer"
                                >
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEyeSlash : faEye} 
                                        className="text-white hover:text-gray-300 transition-colors duration-200" 
                                    />
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:border-[#1F7D53] text-white bg-transparent`}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                                />
                                <button 
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                    className="absolute right-3 top-3 cursor-pointer"
                                >
                                    <FontAwesomeIcon 
                                        icon={showConfirmPassword ? faEyeSlash : faEye} 
                                        className="text-white hover:text-gray-300 transition-colors duration-200" 
                                    />
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 text-[#1F7D53] border-gray-300 rounded focus:ring-[#1F7D53]"
                            />
                            <label htmlFor="terms" className="text-white text-sm">
                                I accept the <Link to="/terms" className="text-[#1F7D53] hover:underline">Terms and Conditions</Link>
                            </label>
                        </div>
                        {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-[#1F7D53] text-white py-3 rounded-lg hover:bg-[#255F38] transition duration-300"
                            >
                                Create Account
                            </button>
                            <div className="mt-4 text-center text-white">
                                Or
                            </div>
                            <div className="mt-4 flex space-x-4">
                                <button className="flex-1 py-3 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 group">
                                    <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 mx-auto text-white group-hover:text-black" />
                                </button>   
                                <button className="flex-1 py-3 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 group">
                                    <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 mx-auto text-white group-hover:text-black" />
                                </button>
                            </div>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-white">
                        Already have an account? {' '}
                        <Link to="/login" className="text-[#1F7D53] hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome to Local Store</h2>
                    <p className="text-lg">Your first step to buy local products</p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
