import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { compressImage } from "../../utils/imageCompression";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    phone_number: "",
    age: "",
    profile_color: "#3bab7e",
    profile_text_color: "#ffffff",
    profile_image: "",
    bio: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    },
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "candidates"
  const [removedFavorites, setRemovedFavorites] = useState([]); // Track recently removed for undo

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/me", {
        withCredentials: true,
      });
      setUser(res.data);
      setFormData({
        user_name: res.data.user_name || "",
        email: res.data.email || "",
        phone_number: res.data.phone_number || "",
        age: res.data.age || "",
        profile_color: res.data.profile_color || "#3bab7e",
        profile_text_color: res.data.profile_text_color || "#ffffff",
        profile_image: res.data.profile_image || "",
        bio: res.data.bio || "",
        address: {
          street: res.data.address?.street || "",
          city: res.data.address?.city || "",
          state: res.data.address?.state || "",
          zip_code: res.data.address?.zip_code || "",
          country: res.data.address?.country || "",
        },
      });
      if (res.data.profile_image) {
        setImagePreview(res.data.profile_image);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view your profile");
        navigate("/login");
      } else {
        toast.error("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setAvatarFile(file);
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let profileImageUrl = formData.profile_image;

      // If new avatar file is selected, compress it
      if (avatarFile && avatarFile instanceof File) {
        try {
          profileImageUrl = await compressImage(avatarFile, {
            maxWidth: 800,
            maxHeight: 800,
            quality: 0.85,
            maxSizeMB: 1,
          });
        } catch (error) {
          console.error("Image compression error:", error);
          toast.warning("Image compression failed, using original image");
          const reader = new FileReader();
          profileImageUrl = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(avatarFile);
          });
        }
      }

      const updateData = {
        ...formData,
        profile_image: profileImageUrl,
        age: formData.age ? Number(formData.age) : undefined,
      };

      const res = await axios.put(
        "http://localhost:5000/api/user/me",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully!");
      setUser(res.data.user);
      setEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        user_name: user.user_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        age: user.age || "",
        profile_color: user.profile_color || "#3bab7e",
        profile_text_color: user.profile_text_color || "#ffffff",
        profile_image: user.profile_image || "",
        bio: user.bio || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zip_code: user.address?.zip_code || "",
          country: user.address?.country || "",
        },
      });
      setImagePreview(user.profile_image || null);
    }
    setEditing(false);
    setAvatarFile(null);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/user/me/password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.error || "Failed to change password");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleAvatarChange = async (file) => {
    if (!file) return;

    try {
      let profileImageUrl;
      try {
        profileImageUrl = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.85,
          maxSizeMB: 1,
        });
      } catch (error) {
        console.error("Image compression error:", error);
        toast.warning("Image compression failed, using original image");
        const reader = new FileReader();
        profileImageUrl = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const updateData = {
        ...formData,
        profile_image: profileImageUrl,
      };

      const res = await axios.put(
        "http://localhost:5000/api/user/me",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success("Profile picture updated!");
      setUser(res.data.user);
      setFormData({ ...formData, profile_image: profileImageUrl });
      setImagePreview(profileImageUrl);
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error(error.response?.data?.error || "Failed to update profile picture");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    // Case-sensitive username check
    if (deleteUsername !== user.user_name) {
      toast.error("Username does not match. Please type your username exactly as shown.");
      return;
    }

    try {
      // Use POST instead of DELETE to ensure body is parsed correctly
      await axios.post("http://localhost:5000/api/user/me/delete", {
        username: deleteUsername,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success("Account deleted successfully");
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.error || "Failed to delete account");
    }
  };

  const fetchFavorites = async () => {
    try {
      setFavoritesLoading(true);
      const res = await axios.get("http://localhost:5000/api/user/me/favorites", {
        withCredentials: true,
      });
      setFavorites(res.data.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      // Don't show error if user is not logged in
      if (error.response?.status !== 401) {
        toast.error("Failed to load favorites");
      }
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveFavorite = async (animalId, animalData) => {
    try {
      // Store removed animal for undo BEFORE removing (so we have the data even if list becomes empty)
      const removedItem = animalData && !animalData.removed && animalData.name 
        ? { animalId, animalData, timestamp: Date.now() }
        : null;
      
      await axios.delete("http://localhost:5000/api/user/me/favorites", {
        data: { animalId },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      // Store in state for undo functionality
      if (removedItem) {
        setRemovedFavorites(prev => [...prev, removedItem]);
        
        // Show toast with undo button
        const UndoToast = ({ closeToast }) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span>Removed: {removedItem.animalData.name}</span>
              <button
                onClick={() => {
                  closeToast();
                  handleUndoRemove(removedItem);
                }}
                style={{
                  padding: '4px 12px',
                  background: 'white',
                  color: '#3bab7e',
                  border: '1px solid #3bab7e',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#3bab7e';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#3bab7e';
                }}
              >
                Undo
              </button>
            </div>
          );
        };
        
        toast.success(<UndoToast />, {
          autoClose: 10000,
          closeOnClick: false,
        });
        
        // Auto-remove from undo list after toast expires
        setTimeout(() => {
          setRemovedFavorites(prev => prev.filter(item => item.animalId !== animalId));
        }, 10000);
      } else {
        toast.success("Removed from Adoption Candidates");
      }
      
      fetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error(error.response?.data?.error || "Failed to remove favorite");
    }
  };

  const handleUndoRemove = async (removedItem) => {
    try {
      await axios.post("http://localhost:5000/api/user/me/favorites", {
        animalId: removedItem.animalId,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      // Remove from undo list
      setRemovedFavorites(prev => prev.filter(item => item.animalId !== removedItem.animalId));
      
      toast.success("Restored to Adoption Candidates");
      fetchFavorites();
    } catch (error) {
      console.error("Error restoring favorite:", error);
      toast.error(error.response?.data?.error || "Failed to restore favorite");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <p>User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="browser-tabs">
          <button
            className={`browser-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="tab-icon">👤</span>
            <span className="tab-title">My Profile</span>
          </button>
          <button
            className={`browser-tab ${activeTab === "candidates" ? "active" : ""}`}
            onClick={() => setActiveTab("candidates")}
          >
            <span className="tab-icon">❤️</span>
            <span className="tab-title">Adoption Candidates</span>
            {favorites.length > 0 && (
              <span className="tab-badge">{favorites.length}</span>
            )}
          </button>
        </div>
        {activeTab === "profile" && !editing && (
          <button className="edit-button" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="profile-tab-content">
            <div className="profile-sidebar">
          <div className="profile-avatar-section">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div
                className="profile-avatar-placeholder"
                style={{
                  backgroundColor: formData.profile_color,
                  color: formData.profile_text_color,
                }}
              >
                {formData.user_name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <label className="avatar-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAvatarFile(file);
                    setImagePreview(URL.createObjectURL(file));
                    handleAvatarChange(file);
                  }
                }}
                className="avatar-upload-input"
              />
              Change Photo
            </label>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Role</span>
              <span className="stat-value">{user.role || "User"}</span>
            </div>
            {user.last_login && (
              <div className="stat-item">
                <span className="stat-label">Last Login</span>
                <span className="stat-value">
                  {new Date(user.last_login).toLocaleDateString()}
                </span>
              </div>
            )}
            {user.adoption_history?.length > 0 && (
              <div className="stat-item">
                <span className="stat-label">Adoptions</span>
                <span className="stat-value">{user.adoption_history.length}</span>
              </div>
            )}
            {user.favorites?.length > 0 && (
              <div className="stat-item">
                <span className="stat-label">Favorites</span>
                <span className="stat-value">{user.favorites.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="profile-main">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h2 className="section-title">Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!editing}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Profile Appearance</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Profile Picture</label>
                  <div className="profile-picture-upload-wrapper">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="profile-picture-preview"
                      />
                    ) : (
                      <div
                        className="profile-picture-placeholder"
                        style={{
                          backgroundColor: formData.profile_color,
                          color: formData.profile_text_color,
                        }}
                      >
                        {formData.user_name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <label className="profile-picture-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setAvatarFile(file);
                            setImagePreview(URL.createObjectURL(file));
                            handleAvatarChange(file);
                          }
                        }}
                        className="profile-picture-upload-input"
                      />
                      {imagePreview ? "Change Picture" : "Upload Picture"}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Background Color</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      name="profile_color"
                      value={formData.profile_color}
                      onChange={handleChange}
                      disabled={!editing}
                      className="color-input"
                    />
                    <span className="color-value">{formData.profile_color}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Text Color</label>
                  <div className="color-picker-wrapper">
                    <input
                      type="color"
                      name="profile_text_color"
                      value={formData.profile_text_color}
                      onChange={handleChange}
                      disabled={!editing}
                      className="color-input"
                    />
                    <span className="color-value">{formData.profile_text_color}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Bio</h2>
              <div className="form-group">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="bio-textarea"
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Address</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="address.zip_code"
                    value={formData.address.zip_code}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>
            </div>

            {editing && (
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          <div className="form-section account-settings-section">
            <h2 className="section-title">Account Settings</h2>

            {!showPasswordChange && !showDeleteAccount ? (
              <div className="account-actions">
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(true)}
                  className="change-password-button"
                >
                  Change Password
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Log Out
                </button>
                {user && user.role === "user" && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccount(true)}
                    className="delete-account-button"
                  >
                    Delete My Account
                  </button>
                )}
              </div>
            ) : showPasswordChange ? (
              <form onSubmit={handlePasswordChange} className="password-change-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                    className="password-input"
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    className="password-input"
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    className="password-input"
                  />
                </div>
                <div className="password-form-actions">
                  <button type="submit" className="save-button">
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          {/* Delete Account Form - Shows when delete button is clicked */}
        </div>

          {/* Delete Account Section - Only for users with role "user" */}
          {user && user.role === "user" && showDeleteAccount && (
            <div className="form-section delete-account-section">
              <h2 className="section-title delete-section-title">Delete Account</h2>
              <div className="delete-account-warning">
                <p className="warning-text">
                  <strong>Warning:</strong> This action cannot be undone. This will permanently delete your account and all associated data.
                </p>
                <p className="confirmation-text">
                  To confirm, please type your username: <strong>{user.user_name}</strong>
                </p>
              </div>

              <form onSubmit={handleDeleteAccount} className="delete-account-form">
                <div className="form-group">
                  <label>Type your username to confirm deletion</label>
                  <input
                    type="text"
                    value={deleteUsername}
                    onChange={(e) => setDeleteUsername(e.target.value)}
                    placeholder={`Type: ${user.user_name}`}
                    required
                    className="delete-username-input"
                    autoComplete="off"
                  />
                  <p className="username-hint">
                    You must type: <strong>{user.user_name}</strong> (case-sensitive)
                  </p>
                </div>
                <div className="delete-form-actions">
                  <button
                    type="submit"
                    className="confirm-delete-button"
                    disabled={deleteUsername !== user.user_name}
                  >
                    Permanently Delete Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteAccount(false);
                      setDeleteUsername("");
                    }}
                    className="cancel-delete-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        )}

        {activeTab === "candidates" && (
          <div className="tab-content candidates-tab-content">
            <div className="favorites-section">
              <h2 className="section-title" style={{ marginBottom: '30px', fontSize: '2rem', color: 'var(--primary)', fontWeight: 700, textAlign: 'center' }}>Adoption Candidates</h2>
              {favoritesLoading ? (
                <div className="loading-favorites">Loading favorites...</div>
              ) : favorites.length === 0 ? (
                <div className="no-favorites">
                  <p>You haven't added any animals to your adoption candidates list yet.</p>
                  <p className="favorites-hint">Visit an animal's page and click the heart icon to add them to your list!</p>
                </div>
              ) : (
                <div className="favorites-grid catalog-cards">
                    {favorites.map((animal) => {
                      // Check if animal exists (wasn't deleted/adopted)
                      // When populate fails, animal will have removed: true or no name
                      const animalExists = animal && animal._id && animal.name && !animal.removed;
                      const animalRemoved = !animalExists;

                      return (
                        <div key={animal?._id || Math.random()} className="catalog-card-wrapper">
                          {animalRemoved ? (
                            <div className="catalog-card favorite-card-removed">
                              <div className="removed-icon">🏠</div>
                              <h3 className="removed-animal-name">
                                Animal
                              </h3>
                              <p className="removed-message">
                                This animal has found a home! 🎉
                              </p>
                              <button
                                onClick={() => handleRemoveFavorite(animal?._id || animal, animal)}
                                className="remove-favorite-btn"
                              >
                                Remove from List
                              </button>
                            </div>
                          ) : (
                            <Link to={`/animal/${animal._id}`} className="catalog-card-link">
                              <div className="catalog-card favorite-card">
                                <div className="catalog-image favorite-image">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveFavorite(animal._id, animal);
                                    }}
                                    className="favorite-heart-btn favorited"
                                    title="Remove from Adoption Candidates"
                                  >
                                    ❤️
                                  </button>
                                  <img src={animal.img || "/placeholder.png"} alt={animal.name} />
                                  <div className="card-overlay favorite-overlay">
                                    <span className="card-adoption-type favorite-adoption-type">
                                      {animal.adoption_type === "Permanent" ? "Permanent Adoption" : 
                                       animal.adoption_type === "Foster" ? "Foster Care" : 
                                       animal.adoption_type || "Adoption"}
                                    </span>
                                  </div>
                                </div>
                                <div className="card-content favorite-content">
                                  <h3>{animal.name || "Unnamed"}</h3>
                                  <p className="card-type">{animal.type || ""}</p>
                                  <div className="card-details favorite-badges">
                                    {animal.category && <span className="card-badge favorite-badge">{animal.category}</span>}
                                    <span className="card-badge favorite-badge">{animal.animal || animal.type || ""}</span>
                                    {animal.breed && <span className="card-badge favorite-badge">Breed: {animal.breed}</span>}
                                    {animal.age && <span className="card-badge favorite-badge">Age: {animal.age}</span>}
                                    {animal.gender && (
                                      <span className="card-badge favorite-badge">
                                        Gender: {animal.gender}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
