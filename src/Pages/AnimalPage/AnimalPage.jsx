import { useEffect, useState } from "react";
import axios from "axios";
import "./AnimalPage.css";
import { useParams, Link } from "react-router-dom";

const AnimalPage = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/animal/${id}`);
        setAnimal(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load animal");
        setError("Failed to load animal information");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchAnimal();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="animal-page-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="animal-page-container">
        <div className="error-message">
          <p>{error || "Animal not found"}</p>
          <Link to="/animalCatalog" className="back-link">← Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-page-container">
      <Link to="/animalCatalog" className="back-link">← Back to Catalog</Link>
      
      <div className="animal-profile">
        <div className="animal-header">
          <div className="animal-image-section">
            <img src={animal.img} alt={animal.name} className="animal-main-image" />
            <div className="adoption-badge">
              {animal.adoption_type === "Permanent" ? "Permanent Adoption" : 
               animal.adoption_type === "Foster" ? "Foster Care" : 
               animal.adoption_type || "Adoption"}
            </div>
          </div>
          
          <div className="animal-basic-info">
            <h1 className="animal-name">{animal.name || "Unnamed"}</h1>
            <div className="animal-tags">
              {animal.category && <span className="info-tag">{animal.category}</span>}
              {animal.type && <span className="info-tag">{animal.type}</span>}
              {animal.animal && <span className="info-tag">{animal.animal}</span>}
              {animal.breed && <span className="info-tag">{animal.breed}</span>}
            </div>
            
            <div className="quick-info-grid">
              {animal.age && (
                <div className="quick-info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{animal.age} years</span>
                </div>
              )}
              {animal.gender && (
                <div className="quick-info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{animal.gender}</span>
                </div>
              )}
              {animal.tameness_level && (
                <div className="quick-info-item">
                  <span className="info-label">Tameness</span>
                  <span className="info-value">{animal.tameness_level}</span>
                </div>
              )}
              {animal.medical_condition && (
                <div className="quick-info-item">
                  <span className="info-label">Health Status</span>
                  <span className="info-value">{animal.medical_condition}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="animal-details">
          <div className="details-section">
            <h2 className="section-title">Life Expectancy</h2>
            <div className="info-box">
              {animal.life_expectancy?.captivity && (
                <div className="info-row">
                  <span className="info-label">In Captivity:</span>
                  <span className="info-value">{animal.life_expectancy.captivity}</span>
                </div>
              )}
              {animal.life_expectancy?.wild && animal.life_expectancy.wild !== "N/A" && (
                <div className="info-row">
                  <span className="info-label">In the Wild:</span>
                  <span className="info-value">{animal.life_expectancy.wild}</span>
                </div>
              )}
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Care Requirements</h2>
            <div className="info-box">
              {animal.care_requirements?.food && (
                <div className="info-row">
                  <span className="info-label">Food:</span>
                  <span className="info-value">{animal.care_requirements.food}</span>
                </div>
              )}
              {animal.care_requirements?.attention && (
                <div className="info-row">
                  <span className="info-label">Attention Needed:</span>
                  <span className="info-value">{animal.care_requirements.attention}</span>
                </div>
              )}
              {animal.care_requirements?.yearly_cost && (
                <div className="info-row">
                  <span className="info-label">Estimated Yearly Cost:</span>
                  <span className="info-value">{animal.care_requirements.yearly_cost}</span>
                </div>
              )}
              {animal.care_requirements?.average_vet_cost && (
                <div className="info-row">
                  <span className="info-label">Average Vet Visit Cost:</span>
                  <span className="info-value">{animal.care_requirements.average_vet_cost}</span>
                </div>
              )}
              {animal.care_requirements?.insurance && (
                <div className="info-row">
                  <span className="info-label">Insurance:</span>
                  <span className="info-value">{animal.care_requirements.insurance}</span>
                </div>
              )}
            </div>
          </div>

          <div className="details-section">
            <h2 className="section-title">Location & Adoption Details</h2>
            <div className="info-box">
              {animal.address && (
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{animal.address}</span>
                </div>
              )}
              {animal.adoption_type && (
                <div className="info-row">
                  <span className="info-label">Adoption Type:</span>
                  <span className="info-value">
                    {animal.adoption_type === "Permanent" ? "Permanent Adoption" : 
                     animal.adoption_type === "Foster" ? "Foster Care" : 
                     animal.adoption_type}
                  </span>
                </div>
              )}
              {animal.foster_duration && (
                <div className="info-row">
                  <span className="info-label">Foster Duration:</span>
                  <span className="info-value">{animal.foster_duration}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalPage;