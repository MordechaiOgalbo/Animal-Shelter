import React, { useState } from "react";
import "./ReportAnimal.css";
import { IoPaw } from "react-icons/io5";
import { PiBirdFill } from "react-icons/pi";
import { FaCat } from "react-icons/fa";
import { FaDog } from "react-icons/fa";
import { GiSquirrel } from "react-icons/gi";
import { FaExclamationTriangle } from "react-icons/fa";

const ReportAnimal = () => {
  const [formData, setFormData] = useState({
    animalType: "",
    location: "",
    description: "",
    urgency: "medium",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    additionalInfo: "",
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...formData.images, ...files];
      setFormData({
        ...formData,
        images: newImages
      });

      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setFormData({
      ...formData,
      images: newImages
    });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    alert("Thank you for your report! We will respond as soon as possible.");
    // Revoke all image preview URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    // Reset form
    setFormData({
      animalType: "",
      location: "",
      description: "",
      urgency: "medium",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      additionalInfo: "",
      images: []
    });
    setImagePreviews([]);
  };

  return (
    <section className="report-animal-page">
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
      <FaExclamationTriangle className="floating-icon alert-1" />

      {/* Page Title */}
      <h2 className="report-title">Report a Wild Animal in Need</h2>

      {/* Intro */}
      <p className="report-intro">
        Have you spotted a wild animal that appears to be in distress, injured, or in an unusual 
        location? <strong>Noah's Ark</strong> is here to help! Whether it's an animal that's lost, 
        injured, or somewhere it shouldn't be (like a camel in the snow!), we want to know about it. 
        Your report helps us respond quickly and provide the care these animals need.
      </p>

      {/* When to Report */}
      <div className="report-section">
        <h3 className="section-title">
          When to Report
          <span className="alert-heading">
            <FaExclamationTriangle />
          </span>
        </h3>
        <ul className="report-list">
          <li>An animal appears injured, sick, or in distress</li>
          <li>An animal is in an unusual or dangerous location</li>
          <li>An animal seems lost or disoriented</li>
          <li>An animal is in an environment where it clearly doesn't belong</li>
          <li>You notice an animal that needs immediate assistance</li>
          <li>An animal is trapped or unable to move</li>
        </ul>
      </div>

      {/* Report Form */}
      <div className="report-section">
        <h3 className="section-title">
          Submit a Report
          <span className="paw-heading">
            <IoPaw />
          </span>
        </h3>
        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="animalType">Type of Animal *</label>
            <input
              type="text"
              id="animalType"
              name="animalType"
              value={formData.animalType}
              onChange={handleChange}
              placeholder="e.g., Camel, Bird, Cat, Dog, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Street address, landmarks, or GPS coordinates"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description of Situation *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what you observed. What makes you think the animal needs help?"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency Level *</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              required
            >
              <option value="low">Low - Animal seems okay but in unusual location</option>
              <option value="medium">Medium - Animal may need assistance</option>
              <option value="high">High - Animal appears injured or in immediate danger</option>
              <option value="emergency">Emergency - Animal needs immediate rescue</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contactName">Your Name *</label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactPhone">Phone Number *</label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="Your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Email Address <span className="optional-label">(Optional)</span></label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="Your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information <span className="optional-label">(Optional)</span></label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any other details that might be helpful"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Photos <span className="optional-label">(Optional)</span></label>
            <p className="image-upload-note">
              Upload photos of the animal from a safe distance. This helps us better understand the situation.
            </p>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="image-input"
            />
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-container">
                    <img src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-button"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="submit-button">
            Submit Report
          </button>
        </form>
      </div>

      {/* Important Notes */}
      <div className="report-section">
        <h3 className="section-title">
          Important Notes
          <span className="bird-heading">
            <PiBirdFill />
          </span>
        </h3>
        <ul className="report-list">
          <li><strong>Do not approach</strong> wild animals that may be dangerous or stressed</li>
          <li>If the situation is an emergency, please also call local emergency services</li>
          <li>We will respond to your report as quickly as possible based on urgency level</li>
          <li>Please provide accurate location information to help us find the animal</li>
          <li>If possible, take photos from a safe distance (do not put yourself at risk)</li>
          <li>Stay at a safe distance and monitor the animal if possible until help arrives</li>
        </ul>
      </div>

      {/* Contact */}
      <div className="report-section">
        <h3 className="section-title">
          Need Immediate Assistance?
          <span className="alert-heading">
            <FaExclamationTriangle />
          </span>
        </h3>
        <p className="section-text">
          For urgent situations requiring immediate response, please call us directly:
        </p>
        <p className="section-text">
          <strong>Emergency Hotline:</strong> (02) 123-4567<br />
          <strong>Email:</strong> reports@noahsark.org<br />
          <strong>Available:</strong> 24/7 for emergencies
        </p>
      </div>
    </section>
  );
};

export default ReportAnimal;
