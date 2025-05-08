import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faUser, 
  faLock, 
  faEnvelope, 
  faSignOutAlt, 
  faShoppingCart,
  faPalette,
  faCog
} from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
  const { user, logout, updateUser, verifyEmail, changePassword } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [coverColor, setCoverColor] = useState('#213448'); 
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await updateUser(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await changePassword(passwordData);
      setMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  const handleVerifyEmail = async () => {
    setMessage(null);
    setError(null);

    try {
      await verifyEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to log out. Please try again.');
    }
  };

  const colorOptions = [
    '#213448',
    '#4F46E5', 
    '#10B981', 
    '#EF4444', 
    '#F59E0B', 
    '#8B5CF6', 
    '#EC4899', 
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="cursor-pointer fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700 h-5 w-5" />
      </button>

      {/* Profile Header */}
      <div 
        className="h-48 w-full relative"
        style={{ backgroundColor: coverColor }}
      >
        <div className="absolute -bottom-16 left-8">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-gray-500 text-4xl" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FontAwesomeIcon icon={faUser} className="mr-3" />
                Update Profile
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'password' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FontAwesomeIcon icon={faLock} className="mr-3" />
                Change Password
              </button>
              {!user?.emailVerified && (
                <button
                  onClick={() => setActiveTab('verify')}
                  className={`cursor-pointer w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'verify' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
                  Verify Email
                </button>
              )}
              <button
                onClick={() => setActiveTab('appearance')}
                className={`cursor-pointer w-full text-left px-4 py-2 rounded-md flex items-center ${activeTab === 'appearance' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FontAwesomeIcon icon={faPalette} className="mr-3" />
                Appearance
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="cursor-pointer w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
                Go to Cart
              </button>
              <button
                onClick={handleLogout}
                className="cursor-pointer w-full text-left px-4 py-2 rounded-md flex items-center text-gray-700 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                Logout
              </button>
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {message && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Profile Update Form */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Update Profile</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-[#213448] text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Change Password Form */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-[#213448] text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {/* Verify Email */}
            {activeTab === 'verify' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Verify Email</h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <p className="text-yellow-700">Your email is not verified. Please check your inbox for a verification link.</p>
                </div>
                <button
                  onClick={handleVerifyEmail}
                  className="cursor-pointer px-4 py-2 bg-[#213448] text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Resend Verification Email
                </button>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Cover Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setCoverColor(color)}
                          className="cursor-pointer h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#213448]"
                          style={{ backgroundColor: color }}
                          aria-label={`Set cover color to ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;