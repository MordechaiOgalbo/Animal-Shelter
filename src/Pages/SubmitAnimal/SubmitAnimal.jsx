import React, { useState, useEffect, useMemo, useRef } from "react";
import "./SubmitAnimal.css";
import { IoPaw } from "react-icons/io5";
import { PiBirdFill } from "react-icons/pi";
import { FaCat } from "react-icons/fa";
import { FaDog } from "react-icons/fa";
import { GiSquirrel } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { compressImage } from "../../utils/imageCompression";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Autocomplete Input Component
const AutocompleteInput = ({
  name,
  value,
  onChange,
  placeholder,
  suggestions,
  required = false,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) &&
        suggestion.toLowerCase() !== value.toLowerCase()
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setIsOpen(filtered.length > 0 && value.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e);
    if (e.target.value.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({
      target: { name, value: suggestion }
    });
    setIsOpen(false);
  };

  return (
    <div className="autocomplete-wrapper">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => value && filteredSuggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        required={required}
        className="autocomplete-input"
      />
      {isOpen && filteredSuggestions.length > 0 && (
        <div ref={dropdownRef} className="autocomplete-dropdown">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="autocomplete-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SubmitAnimal = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    categoryCustom: "",
    type: "",
    typeCustom: "",
    animal: "",
    breed: "",
    gender: "",
    age: "",
    life_expectancy_captivity: "",
    life_expectancy_wild: "",
    medical_condition: "",
    tameness_level: "",
    tamenessCustom: "",
    care_food: "",
    care_attention: "",
    care_yearly_cost: "",
    care_vet_cost: "",
    care_insurance: "",
    adoption_type: "",
    foster_duration: "",
    address: "",
    addressCustom: "",
    img: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Fetch animals to get existing values for autocomplete
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/animal");
        setAnimals(res.data);
      } catch (err) {
        console.error("Failed to load animals for autocomplete");
      }
    };
    fetchAnimals();
  }, []);

  // Extract unique values for autocomplete
  const categories = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.category).filter(Boolean))];
    return unique.sort();
  }, [animals]);

  const types = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.type).filter(Boolean))];
    return unique.sort();
  }, [animals]);

  const breeds = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.breed).filter(Boolean))];
    return unique.sort();
  }, [animals]);

  const tamenessLevels = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.tameness_level).filter(Boolean))];
    return unique.sort();
  }, [animals]);

  const locations = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.address).filter(Boolean))];
    return unique.sort();
  }, [animals]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({
        ...formData,
        img: file
      });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle name: if empty, set to "unsure"
    const nameValue = formData.name.trim() || "unsure";

    try {
      // Convert and compress image file to data URL if present
      let imgUrl = "";
      if (formData.img && formData.img instanceof File) {
        try {
          // Compress image: max 1600x1600px, quality 0.75, max 1.5MB (more aggressive compression)
          imgUrl = await compressImage(formData.img, {
            maxWidth: 1600,
            maxHeight: 1600,
            quality: 0.75,
            maxSizeMB: 1.5
          });
        } catch (error) {
          console.error("Image compression error:", error);
          toast.warning("Image compression failed, using original image");
          // Fallback to original if compression fails
          const reader = new FileReader();
          imgUrl = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(formData.img);
          });
        }
      } else if (formData.img) {
        // If it's already a URL string, use it
        imgUrl = formData.img;
      }

      // Build the request body as JSON
      const requestBody = {
        name: nameValue,
        category: formData.category === '__custom__' ? (formData.categoryCustom || '') : (formData.category || ''),
        type: formData.type === '__custom__' ? (formData.typeCustom || '') : (formData.type || ''),
        animal: formData.animal || '',
        breed: formData.breed || '',
        gender: formData.gender || 'Unknown',
        age: formData.age || undefined,
        medical_condition: formData.medical_condition || '',
        tameness_level: formData.tameness_level === '__custom__' ? (formData.tamenessCustom || '') : (formData.tameness_level || ''),
        adoption_type: formData.adoption_type || '',
        foster_duration: formData.foster_duration || '',
        address: formData.address === '__custom__' ? (formData.addressCustom || '') : (formData.address || ''),
        img: imgUrl,
        // Add nested object fields
        life_expectancy_captivity: formData.life_expectancy_captivity || '',
        life_expectancy_wild: formData.life_expectancy_wild || '',
        care_food: formData.care_food || '',
        care_attention: formData.care_attention || '',
        care_yearly_cost: formData.care_yearly_cost || '',
        care_vet_cost: formData.care_vet_cost || '',
        care_insurance: formData.care_insurance || '',
      };

      const res = await axios.post(
        "http://localhost:5000/api/animal",
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      toast.success("Animal submitted successfully! We'll review it soon.");
      navigate("/animalCatalog");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit animal. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <section className="submit-animal-page">
      {/* Floating/Background Icons */}
      <IoPaw className="floating-icon icon-1" />
      <IoPaw className="floating-icon icon-2" />
      <IoPaw className="floating-icon icon-3" />
      <IoPaw className="floating-icon icon-4" />
      <PiBirdFill className="floating-icon bird-1" />
      <PiBirdFill className="floating-icon bird-2" />
      <FaCat className="floating-icon cat-1" />
      <FaDog className="floating-icon dog-1" />
      <GiSquirrel className="floating-icon squirrel-1" />
      <FaHeart className="floating-icon heart-1" />

      {/* Page Title */}
      <h2 className="submit-animal-title">Submit Animal for Adoption</h2>

      {/* Intro */}
      <p className="submit-animal-intro">
        Do you have an animal that needs a new home? <strong>Noah's Ark</strong> can help!
        Fill out the form below to submit an animal for adoption. We'll review your submission
        and add it to our catalog to help find the perfect home.
      </p>

      {/* Support Contact Notice */}
      <div className="support-notice-section">
        <p className="support-notice-text">
          Don't see the type or category of your animal? Please contact our support and we'll get back to you!
        </p>
        <div className="support-contact-info">
          <p className="support-email">📧 Email: support@noahsark.org</p>
          <p className="support-phone">📞 Phone: (555) 123-4567</p>
        </div>
      </div>

      {/* Submission Form */}
      <div className="submit-animal-section">
        <h3 className="section-title">
          Animal Information
          <span className="paw-heading">
            <IoPaw />
          </span>
        </h3>
        <form className="submit-animal-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h4 className="form-section-title">Basic Information</h4>

            <div className="form-group">
              <label htmlFor="name">Animal Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter the animal's name (or 'unsure' if unknown)"
                required
              />
              <p className="field-hint">If it doesn't have a name, write "unsure"</p>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category === "__custom__" ? "__custom__" : formData.category}
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setFormData({ ...formData, category: "__custom__", categoryCustom: "" });
                  } else {
                    setFormData({ ...formData, category: e.target.value, categoryCustom: "" });
                  }
                }}
                required={formData.category !== "__custom__"}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__custom__">Other (specify below)</option>
              </select>
              {formData.category === "__custom__" && (
                <input
                  type="text"
                  name="categoryCustom"
                  value={formData.categoryCustom || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, categoryCustom: e.target.value });
                  }}
                  placeholder="Enter custom category"
                  required
                  className="custom-input"
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="type">Type <span className="optional-label">(Optional)</span></label>
              <select
                id="type"
                name="type"
                value={formData.type === "__custom__" ? "__custom__" : formData.type}
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setFormData({ ...formData, type: "__custom__", typeCustom: "" });
                  } else {
                    setFormData({ ...formData, type: e.target.value, typeCustom: "" });
                  }
                }}
              >
                <option value="">Select type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
                <option value="__custom__">Other (specify below)</option>
              </select>
              {formData.type === "__custom__" && (
                <input
                  type="text"
                  name="typeCustom"
                  value={formData.typeCustom || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, typeCustom: e.target.value });
                  }}
                  placeholder="Enter custom type"
                  className="custom-input"
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="animal">Animal <span className="optional-label">(Optional)</span></label>
              <input
                type="text"
                id="animal"
                name="animal"
                value={formData.animal}
                onChange={handleChange}
                placeholder="Additional animal classification"
              />
            </div>

            <div className="form-group">
              <label htmlFor="breed">Breed <span className="optional-label">(Optional)</span></label>
              <AutocompleteInput
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="Animal breed"
                suggestions={breeds}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="age">Age <span className="optional-label">(Optional)</span></label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age in years"
                min="0"
              />
            </div>
          </div>

          {/* Life Expectancy */}
          <div className="form-section">
            <h4 className="form-section-title">Life Expectancy <span className="optional-label">(Optional)</span></h4>

            <div className="form-group">
              <label htmlFor="life_expectancy_captivity">In Captivity</label>
              <input
                type="text"
                id="life_expectancy_captivity"
                name="life_expectancy_captivity"
                value={formData.life_expectancy_captivity}
                onChange={handleChange}
                placeholder="e.g., 10-15 years"
              />
            </div>

            <div className="form-group">
              <label htmlFor="life_expectancy_wild">In the Wild</label>
              <input
                type="text"
                id="life_expectancy_wild"
                name="life_expectancy_wild"
                value={formData.life_expectancy_wild}
                onChange={handleChange}
                placeholder="e.g., 8-12 years"
              />
            </div>
          </div>

          {/* Health & Behavior */}
          <div className="form-section">
            <h4 className="form-section-title">Health & Behavior <span className="optional-label">(Optional)</span></h4>

            <div className="form-group">
              <label htmlFor="medical_condition">Medical Condition</label>
              <textarea
                id="medical_condition"
                name="medical_condition"
                value={formData.medical_condition}
                onChange={handleChange}
                placeholder="Describe any medical conditions or health issues"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tameness_level">Tameness Level</label>
              <select
                id="tameness_level"
                name="tameness_level"
                value={formData.tameness_level === "__custom__" ? "__custom__" : formData.tameness_level}
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setFormData({ ...formData, tameness_level: "__custom__", tamenessCustom: "" });
                  } else {
                    setFormData({ ...formData, tameness_level: e.target.value, tamenessCustom: "" });
                  }
                }}
              >
                <option value="">Select tameness level</option>
                {tamenessLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
                <option value="__custom__">Other (specify below)</option>
              </select>
              {formData.tameness_level === "__custom__" && (
                <input
                  type="text"
                  name="tamenessCustom"
                  value={formData.tamenessCustom || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, tamenessCustom: e.target.value });
                  }}
                  placeholder="Enter custom tameness level"
                  className="custom-input"
                />
              )}
            </div>
          </div>

          {/* Care Requirements */}
          <div className="form-section">
            <h4 className="form-section-title">Care Requirements <span className="optional-label">(Optional)</span></h4>

            <div className="form-group">
              <label htmlFor="care_food">Food Requirements</label>
              <textarea
                id="care_food"
                name="care_food"
                value={formData.care_food}
                onChange={handleChange}
                placeholder="Describe food and feeding requirements"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="care_attention">Attention Needs</label>
              <textarea
                id="care_attention"
                name="care_attention"
                value={formData.care_attention}
                onChange={handleChange}
                placeholder="Describe how much attention and interaction the animal needs"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="care_yearly_cost">Estimated Yearly Cost</label>
              <input
                type="text"
                id="care_yearly_cost"
                name="care_yearly_cost"
                value={formData.care_yearly_cost}
                onChange={handleChange}
                placeholder="e.g., $500-1000 per year"
              />
            </div>

            <div className="form-group">
              <label htmlFor="care_vet_cost">Average Vet Cost</label>
              <input
                type="text"
                id="care_vet_cost"
                name="care_vet_cost"
                value={formData.care_vet_cost}
                onChange={handleChange}
                placeholder="e.g., $200-500 per visit"
              />
            </div>

            <div className="form-group">
              <label htmlFor="care_insurance">Insurance Information</label>
              <input
                type="text"
                id="care_insurance"
                name="care_insurance"
                value={formData.care_insurance}
                onChange={handleChange}
                placeholder="Insurance recommendations or requirements (mention if insurance exists or not)"
              />
              <p className="field-hint">Please indicate if insurance exists for this animal or not</p>
            </div>
          </div>

          {/* Adoption Details */}
          <div className="form-section">
            <h4 className="form-section-title">Adoption Details</h4>

            <div className="form-group">
              <label htmlFor="adoption_type">Adoption Type *</label>
              <select
                id="adoption_type"
                name="adoption_type"
                value={formData.adoption_type}
                onChange={handleChange}
                required
              >
                <option value="">Select adoption type</option>
                <option value="Permanent">Permanent Adoption</option>
                <option value="Foster">Foster Care</option>
              </select>
            </div>

            {formData.adoption_type === "Foster" && (
              <div className="form-group">
                <label htmlFor="foster_duration">Foster Duration</label>
                <input
                  type="text"
                  id="foster_duration"
                  name="foster_duration"
                  value={formData.foster_duration}
                  onChange={handleChange}
                  placeholder="e.g., 3 months, 6 months, 1 year"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="address">Location/Address <span className="optional-label">(Optional)</span></label>
              <select
                id="address"
                name="address"
                value={formData.address === "__custom__" ? "__custom__" : formData.address}
                onChange={(e) => {
                  if (e.target.value === "__custom__") {
                    setFormData({ ...formData, address: "__custom__", addressCustom: "" });
                  } else {
                    setFormData({ ...formData, address: e.target.value, addressCustom: "" });
                  }
                }}
              >
                <option value="">Select location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
                <option value="__custom__">Other (specify below)</option>
              </select>
              {formData.address === "__custom__" && (
                <input
                  type="text"
                  name="addressCustom"
                  value={formData.addressCustom || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, addressCustom: e.target.value });
                  }}
                  placeholder="Enter custom location"
                  className="custom-input"
                />
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <h4 className="form-section-title">Animal Photo <span className="optional-label">(Optional)</span></h4>

            <div className="form-group">
              <label htmlFor="img">Upload Photo</label>
              <p className="image-upload-note">
                Upload a clear photo of the animal. This helps potential adopters see the animal.
              </p>
              <input
                type="file"
                id="img"
                name="img"
                accept="image/*"
                onChange={handleChange}
                className="image-input"
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, img: null });
                    }}
                    className="remove-image-button"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit Animal for Adoption
          </button>
        </form>
      </div>

      {/* Important Notes */}
      <div className="submit-animal-section">
        <h3 className="section-title">
          Important Information
          <span className="heart-heading">
            <FaHeart />
          </span>
        </h3>
        <ul className="submit-animal-list">
          <li>Please provide accurate and complete information to help find the best home</li>
          <li>We may contact you for additional information or clarification</li>
          <li>Photos help significantly in finding homes for animals</li>
          <li>Required fields are marked with an asterisk (*)</li>
        </ul>
      </div>
    </section>
  );
};

export default SubmitAnimal;
