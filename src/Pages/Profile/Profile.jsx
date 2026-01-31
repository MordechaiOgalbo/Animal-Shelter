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
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "candidates" | "notifications" | "admin"
  const [removedFavorites, setRemovedFavorites] = useState([]); // Track recently removed for undo
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsUnread, setNotificationsUnread] = useState(0);

  // Admin panel state
  const [adminSubTab, setAdminSubTab] = useState("dashboard"); // "dashboard" | "animals" | "users" | "applications" | "notifications"
  const [adminStats, setAdminStats] = useState(null);
  const [adminAnimals, setAdminAnimals] = useState([]);
  const [adminAnimalsLoading, setAdminAnimalsLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [adminApplications, setAdminApplications] = useState([]);
  const [adminApplicationsLoading, setAdminApplicationsLoading] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [adminNotificationsLoading, setAdminNotificationsLoading] = useState(false);
  
  // Animal editing state
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [animalEditForm, setAnimalEditForm] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "admin" && activeTab === "admin") {
      if (adminSubTab === "dashboard" && !adminStats) {
        fetchAdminStats();
      } else if (adminSubTab === "animals" && adminAnimals.length === 0 && !adminAnimalsLoading) {
        fetchAdminAnimals();
      } else if (adminSubTab === "users" && adminUsers.length === 0 && !adminUsersLoading) {
        fetchAdminUsers();
        } else if (adminSubTab === "applications" && adminApplications.length === 0 && !adminApplicationsLoading) {
          fetchAdminApplications();
        } else if (adminSubTab === "notifications" && adminNotifications.length === 0 && !adminNotificationsLoading) {
          fetchAdminNotifications();
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab, adminSubTab]);

  const fetchAdminStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        withCredentials: true,
      });
      setAdminStats(res.data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  const fetchAdminAnimals = async () => {
    try {
      setAdminAnimalsLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/animals", {
        withCredentials: true,
      });
      setAdminAnimals(res.data.animals || []);
    } catch (error) {
      console.error("Error fetching admin animals:", error);
      toast.error("Failed to load animals");
    } finally {
      setAdminAnimalsLoading(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      setAdminUsersLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        withCredentials: true,
      });
      setAdminUsers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast.error("Failed to load users");
    } finally {
      setAdminUsersLoading(false);
    }
  };

  const fetchAdminApplications = async () => {
    try {
      setAdminApplicationsLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/applications", {
        withCredentials: true,
      });
      setAdminApplications(res.data.applications || []);
    } catch (error) {
      console.error("Error fetching admin applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setAdminApplicationsLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      toast.success("User role updated");
      fetchAdminUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      toast.success("User deleted");
      fetchAdminUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete user");
    }
  };

  const handleDeleteAnimal = async (animalId) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/animals/${animalId}`, {
        withCredentials: true,
      });
      toast.success("Animal deleted");
      fetchAdminAnimals();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete animal");
    }
  };

  const handleToggleAdopted = async (animalId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/animals/${animalId}/toggle-adopted`,
        {},
        { withCredentials: true }
      );
      toast.success("Animal status updated");
      fetchAdminAnimals();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update animal");
    }
  };

  const fetchAdminNotifications = async () => {
    try {
      setAdminNotificationsLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/notifications", {
        withCredentials: true,
      });
      setAdminNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setAdminNotificationsLoading(false);
    }
  };

  const handleDeleteNotificationAdmin = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/notifications/${notificationId}`, {
        withCredentials: true,
      });
      toast.success("Notification deleted");
      fetchAdminNotifications();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete notification");
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/applications/${applicationId}`, {
        withCredentials: true,
      });
      toast.success("Application deleted");
      fetchAdminApplications();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete application");
    }
  };

  const handleEditAnimal = (animal) => {
    setEditingAnimal(animal._id);
    setAnimalEditForm({
      name: animal.name || "",
      category: animal.category || "",
      type: animal.type || "",
      animal: animal.animal || "",
      breed: animal.breed || "",
      gender: animal.gender || "Unknown",
      age: animal.age || "",
      medical_condition: animal.medical_condition || "",
      tameness_level: animal.tameness_level || "",
      adoption_type: animal.adoption_type || "",
      foster_duration: animal.foster_duration || "",
      address: animal.address || "",
      img: animal.img || "",
      life_expectancy_captivity: animal.life_expectancy?.captivity || "",
      life_expectancy_wild: animal.life_expectancy?.wild || "",
      care_food: animal.care_requirements?.food || "",
      care_attention: animal.care_requirements?.attention || "",
      care_yearly_cost: animal.care_requirements?.yearly_cost || "",
      care_vet_cost: animal.care_requirements?.average_vet_cost || "",
      care_insurance: animal.care_requirements?.insurance || "",
    });
  };

  const handleSaveAnimalEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/animals/${editingAnimal}`,
        animalEditForm,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Animal updated successfully");
      setEditingAnimal(null);
      setAnimalEditForm({});
      fetchAdminAnimals();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update animal");
    }
  };

  const handleCancelAnimalEdit = () => {
    setEditingAnimal(null);
    setAnimalEditForm({});
  };

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const res = await axios.get("http://localhost:5000/api/notifications/me", {
        withCredentials: true,
      });
      setNotifications(res.data.notifications || []);
      setNotificationsUnread(res.data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/me/${id}/read`,
        {},
        { withCredentials: true }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  const deleteNotification = async (notif) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/me/${notif._id}/delete`,
        {},
        { withCredentials: true }
      );
      fetchNotifications();

      const UndoToast = ({ closeToast }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span>Notification removed.</span>
          <button
            onClick={async () => {
              closeToast();
              try {
                await axios.put(
                  `http://localhost:5000/api/notifications/me/${notif._id}/restore`,
                  {},
                  { withCredentials: true }
                );
                fetchNotifications();
              } catch (e) {
                // ignore
              }
            }}
            style={{
              padding: "4px 12px",
              background: "white",
              color: "#3bab7e",
              border: "1px solid #3bab7e",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}
          >
            Undo
          </button>
        </div>
      );

      toast.success(<UndoToast />, { autoClose: 8000, closeOnClick: false });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to remove notification");
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/me/read-all",
        {},
        { withCredentials: true }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications read:", error);
    }
  };

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
          <button
            className={`browser-tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <span className="tab-icon">🔔</span>
            <span className="tab-title">Notifications</span>
            {notificationsUnread > 0 && (
              <span className="tab-badge">{notificationsUnread}</span>
            )}
          </button>
          {user && user.role === "admin" && (
            <button
              className={`browser-tab ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("admin");
                setAdminSubTab("dashboard");
                if (!adminStats) fetchAdminStats();
              }}
            >
              <span className="tab-icon">⚙️</span>
              <span className="tab-title">Admin Panel</span>
            </button>
          )}
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

        {activeTab === "notifications" && (
          <div className="tab-content notifications-tab-content">
            <div className="form-section notifications-section">
              <div className="notifications-header-row">
                <h2 className="section-title">Notifications</h2>
                <button
                  type="button"
                  className="mark-all-read-btn"
                  onClick={markAllNotificationsRead}
                  disabled={notificationsUnread === 0 || notificationsLoading}
                >
                  Mark all read
                </button>
              </div>

              {notificationsLoading ? (
                <div className="loading-favorites">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="no-favorites">
                  <p>You don’t have any notifications yet.</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((n) => (
                    <div key={n._id} className={`notification-item ${n.read ? "" : "unread"}`}>
                      <div className="notification-main">
                        <div className="notification-title">{n.title}</div>
                        {n.message && <div className="notification-message">{n.message}</div>}
                        <div className="notification-meta">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                        </div>
                      </div>

                      <div className="notification-actions">
                        <Link
                          to={`/notification/${n._id}`}
                          className="notification-open"
                          onClick={() => markNotificationRead(n._id)}
                        >
                          View
                        </Link>
                        {!n.read && (
                          <button
                            type="button"
                            className="notification-read-btn"
                            onClick={() => markNotificationRead(n._id)}
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          className="notification-delete-btn"
                          onClick={() => deleteNotification(n)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "admin" && user && user.role === "admin" && (
          <div className="tab-content admin-tab-content">
            <div className="admin-panel-section">
              <div className="admin-subtabs">
                <button
                  className={`admin-subtab ${adminSubTab === "dashboard" ? "active" : ""}`}
                  onClick={() => {
                    setAdminSubTab("dashboard");
                    if (!adminStats) fetchAdminStats();
                  }}
                >
                  📊 Dashboard
                </button>
                <button
                  className={`admin-subtab ${adminSubTab === "animals" ? "active" : ""}`}
                  onClick={() => {
                    setAdminSubTab("animals");
                    if (adminAnimals.length === 0) fetchAdminAnimals();
                  }}
                >
                  🐾 Animals
                </button>
                <button
                  className={`admin-subtab ${adminSubTab === "users" ? "active" : ""}`}
                  onClick={() => {
                    setAdminSubTab("users");
                    if (adminUsers.length === 0 && !adminUsersLoading) {
                      fetchAdminUsers();
                    }
                  }}
                >
                  👥 Users
                </button>
                <button
                  className={`admin-subtab ${adminSubTab === "applications" ? "active" : ""}`}
                  onClick={() => {
                    setAdminSubTab("applications");
                    if (adminApplications.length === 0) fetchAdminApplications();
                  }}
                >
                  📝 Applications
                </button>
                <button
                  className={`admin-subtab ${adminSubTab === "notifications" ? "active" : ""}`}
                  onClick={() => {
                    setAdminSubTab("notifications");
                    if (adminNotifications.length === 0) fetchAdminNotifications();
                  }}
                >
                  🔔 Notifications
                </button>
              </div>

              <div className="admin-content-area">
                {adminSubTab === "dashboard" && adminStats && (
                  <div className="admin-dashboard">
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{adminStats.users.total}</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Total Animals</div>
                        <div className="stat-value">{adminStats.animals.total}</div>
                        <div className="stat-sub">
                          {adminStats.animals.available} available, {adminStats.animals.adopted} adopted
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Applications</div>
                        <div className="stat-value">{adminStats.applications.total}</div>
                        <div className="stat-sub">
                          {adminStats.applications.pending} pending, {adminStats.applications.accepted} accepted,{" "}
                          {adminStats.applications.rejected} rejected
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-label">Notifications</div>
                        <div className="stat-value">{adminStats.notifications.total}</div>
                      </div>
                    </div>
                  </div>
                )}

                {adminSubTab === "animals" && (
                  <div className="admin-section">
                    <h2 className="admin-section-title">All Animals</h2>
                    {adminAnimalsLoading ? (
                      <div className="admin-loading">Loading animals...</div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Submitted By</th>
                              <th>Adopted By</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminAnimals.map((animal) => (
                              <tr key={animal._id} className={animal.adopted ? "adopted-row" : ""}>
                                {editingAnimal === animal._id ? (
                                  <>
                                    <td>
                                      <input
                                        type="text"
                                        value={animalEditForm.name}
                                        onChange={(e) => setAnimalEditForm({ ...animalEditForm, name: e.target.value })}
                                        className="admin-edit-input"
                                        placeholder="Name"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={animalEditForm.category}
                                        onChange={(e) => setAnimalEditForm({ ...animalEditForm, category: e.target.value })}
                                        className="admin-edit-input"
                                        placeholder="Category"
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        value={animalEditForm.type}
                                        onChange={(e) => setAnimalEditForm({ ...animalEditForm, type: e.target.value })}
                                        className="admin-edit-input"
                                        placeholder="Type"
                                      />
                                    </td>
                                    <td>
                                      <span className={`status-badge ${animal.adopted ? "adopted" : "available"}`}>
                                        {animal.adopted ? "Adopted" : "Available"}
                                      </span>
                                    </td>
                                    <td>{animal.submitted_by?.user_name || "Guest"}</td>
                                    <td>{animal.adopted_by?.user_name || "—"}</td>
                                    <td>
                                      <div className="admin-actions">
                                        <button
                                          className="admin-btn small"
                                          onClick={handleSaveAnimalEdit}
                                        >
                                          Save
                                        </button>
                                        <button
                                          className="admin-btn small"
                                          onClick={handleCancelAnimalEdit}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>
                                      <Link to={`/animal/${animal._id}`} className="admin-link">
                                        {animal.name || "Unnamed"}
                                      </Link>
                                    </td>
                                    <td>{animal.category || "—"}</td>
                                    <td>{animal.type || "—"}</td>
                                    <td>
                                      <span className={`status-badge ${animal.adopted ? "adopted" : "available"}`}>
                                        {animal.adopted ? "Adopted" : "Available"}
                                      </span>
                                    </td>
                                    <td>{animal.submitted_by?.user_name || "Guest"}</td>
                                    <td>{animal.adopted_by?.user_name || "—"}</td>
                                    <td>
                                      <div className="admin-actions">
                                        <button
                                          className="admin-btn small"
                                          onClick={() => handleEditAnimal(animal)}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="admin-btn small"
                                          onClick={() => handleToggleAdopted(animal._id)}
                                        >
                                          {animal.adopted ? "Mark Available" : "Mark Adopted"}
                                        </button>
                                        <button
                                          className="admin-btn small danger"
                                          onClick={() => handleDeleteAnimal(animal._id)}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {adminSubTab === "users" && (
                  <div className="admin-section">
                    <h2 className="admin-section-title">All Users</h2>
                    {adminUsersLoading ? (
                      <div className="admin-loading">Loading users...</div>
                    ) : adminUsers.length === 0 ? (
                      <div className="admin-loading">No users found.</div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Created</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminUsers.map((u) => (
                              <tr key={u._id}>
                                <td>{u.user_name}</td>
                                <td>{u.email}</td>
                                <td>
                                  <select
                                    value={u.role}
                                    onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                                    className="role-select"
                                  >
                                    <option value="user">User</option>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <button
                                    className="admin-btn small danger"
                                    onClick={() => handleDeleteUser(u._id)}
                                    disabled={u._id === user?._id}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {adminSubTab === "applications" && (
                  <div className="admin-section">
                    <h2 className="admin-section-title">All Applications</h2>
                    {adminApplicationsLoading ? (
                      <div className="admin-loading">Loading applications...</div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Animal</th>
                              <th>Applicant</th>
                              <th>Status</th>
                              <th>Submitted</th>
                              <th>Reviewed By</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminApplications.map((app) => (
                              <tr key={app._id}>
                                <td>
                                  {app.animal ? (
                                    <Link to={`/animal/${app.animal._id}`} className="admin-link">
                                      {app.animal.name || "Unknown"}
                                    </Link>
                                  ) : (
                                    "—"
                                  )}
                                </td>
                                <td>{app.applicant_user?.user_name || app.full_name || "Guest"}</td>
                                <td>
                                  <span className={`status-badge ${app.status}`}>
                                    {app.status || "submitted"}
                                  </span>
                                </td>
                                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                <td>{app.reviewed_by?.user_name || "—"}</td>
                                <td>
                                  <div className="admin-actions">
                                    {app.status === "submitted" && (
                                      <Link to={`/review/${app._id}`} className="admin-btn small">
                                        Review
                                      </Link>
                                    )}
                                    <button
                                      className="admin-btn small danger"
                                      onClick={() => handleDeleteApplication(app._id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {adminSubTab === "notifications" && (
                  <div className="admin-section">
                    <h2 className="admin-section-title">All Notifications</h2>
                    {adminNotificationsLoading ? (
                      <div className="admin-loading">Loading notifications...</div>
                    ) : adminNotifications.length === 0 ? (
                      <div className="admin-loading">No notifications found.</div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Recipient</th>
                              <th>Title</th>
                              <th>Message</th>
                              <th>Type</th>
                              <th>Created</th>
                              <th>Read</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminNotifications.map((notif) => (
                              <tr key={notif._id} className={notif.read ? "" : "unread"}>
                                <td>{notif.recipient?.user_name || notif.recipient?.email || "Unknown"}</td>
                                <td>{notif.title}</td>
                                <td className="admin-message-cell">{notif.message || "—"}</td>
                                <td>
                                  <span className="status-badge">{notif.type || "general"}</span>
                                </td>
                                <td>{new Date(notif.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <span className={`status-badge ${notif.read ? "accepted" : "submitted"}`}>
                                    {notif.read ? "Read" : "Unread"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="admin-btn small danger"
                                    onClick={() => handleDeleteNotificationAdmin(notif._id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
