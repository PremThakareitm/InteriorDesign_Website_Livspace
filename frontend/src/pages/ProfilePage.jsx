import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiStar,
  FiImage,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiHome,
  FiSave,
  FiX
} from 'react-icons/fi';

const ProfilePage = () => {
  const { user, token, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    specialization: '',
    experience: '',
    portfolio: [],
    preferences: {
      styles: [],
      roomTypes: [],
      priceRange: { min: 0, max: 0 }
    },
    profileImage: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, designsRes, projectsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/designs/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/projects/user/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (profileRes.data) {
          setProfileData(prevData => ({
            ...prevData,
            ...profileRes.data,
            preferences: {
              ...prevData.preferences,
              ...(profileRes.data.preferences || {}),
            }
          }));
        }
        setDesigns(designsRes.data || []);
        setProjects(projectsRes.data || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    if (token && user?._id) fetchData();
  }, [token, user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value || '' // Ensure empty string if value is null/undefined
      }));
    }
  };

  const handlePreferenceChange = (type, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          name: profileData.name,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          preferences: profileData.preferences
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setUser(response.data);
        setEditing(false);
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50';
        successMessage.textContent = 'Profile updated successfully!';
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/profile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setProfileData(prev => ({
        ...prev,
        profileImage: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.error || 'Failed to upload image');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-48 bg-luxury-gold/20 rounded-t-2xl"></div>
            <div className="bg-black/5 backdrop-blur-lg rounded-b-2xl p-8">
              <div className="h-32 w-32 bg-luxury-gold/20 rounded-full -mt-24"></div>
              <div className="h-8 bg-luxury-gold/20 rounded w-1/3 mt-8"></div>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-luxury-gold/10 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/5 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-luxury-gold/20 to-luxury-bronze/20">
            <div className="absolute inset-0 bg-luxury-pattern opacity-10"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={profileData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=D4AF37&color=fff`}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
                {editing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-luxury-gold/5 transition-colors">
                    <FiEdit2 className="text-luxury-gold" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-luxury-gold text-white rounded-xl hover:bg-luxury-gold/90 transition-colors flex items-center gap-2"
                  >
                    <FiSave className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-black/10 text-gray-700 rounded-xl hover:bg-black/20 transition-colors flex items-center gap-2"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-luxury-gold/10 text-luxury-gold rounded-xl hover:bg-luxury-gold/20 transition-colors flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-black/5 border border-luxury-gold/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                      required
                    />
                  ) : (
                    profileData.name
                  )}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMail className="text-luxury-gold" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiPhone className="text-luxury-gold" />
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-black/5 border border-luxury-gold/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                      />
                    ) : (
                      <span>{profileData.phone || 'Not provided'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin className="text-luxury-gold" />
                    {editing ? (
                      <input
                        type="text"
                        name="location"
                        value={profileData.location || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-black/5 border border-luxury-gold/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                        placeholder="Your location"
                      />
                    ) : (
                      <span>{profileData.location || 'Not provided'}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                {editing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black/5 border border-luxury-gold/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">{profileData.bio || 'No bio provided'}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Design Preferences</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Styles</label>
                    {editing ? (
                      <select
                        multiple
                        name="preferences.styles"
                        value={profileData.preferences.styles}
                        onChange={(e) => handlePreferenceChange('styles', Array.from(e.target.selectedOptions, option => option.value))}
                        className="w-full px-4 py-2 bg-black/5 border border-luxury-gold/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                      >
                        <option value="modern">Modern</option>
                        <option value="contemporary">Contemporary</option>
                        <option value="traditional">Traditional</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.preferences.styles.map((style) => (
                          <span
                            key={style}
                            className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold rounded-full text-sm"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Types</label>
                    {editing ? (
                      <select
                        multiple
                        name="preferences.roomTypes"
                        value={profileData.preferences.roomTypes}
                        onChange={(e) => handlePreferenceChange('roomTypes', Array.from(e.target.selectedOptions, option => option.value))}
                        className="w-full px-4 py-2 bg-black/5 border border-luxury-gold/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/20"
                      >
                        <option value="living">Living Room</option>
                        <option value="bedroom">Bedroom</option>
                        <option value="kitchen">Kitchen</option>
                        <option value="bathroom">Bathroom</option>
                        <option value="office">Home Office</option>
                      </select>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.preferences.roomTypes.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-luxury-gold/10 text-luxury-gold rounded-full text-sm"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {designs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Designs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {designs.slice(0, 3).map((design) => (
                      <div
                        key={design._id}
                        className="bg-black/5 rounded-xl p-4 hover:bg-luxury-gold/5 transition-colors"
                      >
                        <div className="aspect-video rounded-lg overflow-hidden mb-3">
                          <img
                            src={design.image || 'https://via.placeholder.com/300x200'}
                            alt={design.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium text-gray-900">{design.name}</h4>
                        <p className="text-sm text-gray-500">{design.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
