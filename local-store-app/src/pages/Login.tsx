import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: '', // This will store either email or username
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            identifier: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you can check if identifier is email or username
        const isEmail = formData.identifier.includes('@');
        
        // You can then send the appropriate data to your backend
        const loginData = {
            [isEmail ? 'email' : 'username']: formData.identifier,
            password: formData.password
        };
        
        console.log('Login data:', loginData);
        // Handle login logic here
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        
        <div className="flex h-screen login-page">
            {/* Left Column - Login Form */}
            <div className="w-1/2 flex items-center justify-center mt-10">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <Link to="/" className="text-white">
                            <span className='hover:bg-white hover:text-black border border-white rounded p-2'>←</span>
                        </Link>
                    </div>
                    
                    <h1 className="text-4xl font-bold mb-2 text-white">Login</h1>
                    <p className="text-white mb-8">Secure Your Communications with Local Store</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1F7D53] text-white"
                                    placeholder="Username or Email"
                                    value={formData.identifier}
                                    onChange={handleIdentifierChange}
                                />
                                {formData.identifier && (
                                    <span className="absolute right-3 top-3 text-green-500">✓</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 border text-white border-gray-300 rounded-lg focus:outline-none focus:border-[#1F7D53]"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                                />
                                <button 
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-3 cursor-pointer"
                                >
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEyeSlash : faEye} 
                                        className="text-white hover:text-gray-300 transition-colors duration-200" 
                                    />
                                </button>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full cursor-pointer bg-[#1F7D53] text-white py-3 rounded-lg hover:bg-[#255F38] transition duration-300"
                            >
                                Login
                            </button>
                            <div className="mt-4 text-center text-gray-500">
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
                        Don't have an account? {' '}
                        <Link to="/signup" className="text-[#1F7D53] hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-1/2 flex items-center justify-center">
                {/* You can add your content for the right side here */}
                <div className="text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome to Local Store</h2>
                    <p className="text-lg">Your one-stop shop for all local products</p>
                </div>
            </div>
        </div>
    );
};

export default Login;