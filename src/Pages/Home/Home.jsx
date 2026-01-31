import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [recentAnimals, setRecentAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/animal`);
        // Get the last 8 animals (most recently added)
        const animals = res.data || [];
        const last8 = animals.slice(-8).reverse(); // Reverse to show newest first
        setRecentAnimals(last8);
      } catch (err) {
        console.error("Failed to load animals");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-title-container">
            <h1>Noah's Ark</h1>
          </div>
          <p className="hero-subtitle">Waiting for a Home</p>
          <p className="hero-description">
            Not every home is quiet, and not every animal gets a fair start. 
            We help animals find the people they belong with — maybe that's you.
          </p>
          <Link to="/report" className="hero-button report-button">
            Report Animal in Need
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-intro-section">
        <div className="about-intro-content">
          <h2>Welcome to Noah's Ark</h2>
          <p>
            <strong>Noah's Ark</strong> is an animal rescue and care organization
            based in Israel. Our mission is simple: to provide safety, kindness, and
            a second chance to every animal who needs it! Whether a pet was
            abandoned, mistreated, or temporarily without a home, we're here to
            help.
          </p>
        </div>
      </section>

      {/* Recently Added Animals Section */}
      <section className="recent-animals">
        <h2 className="section-title">Recently Added Animals</h2>
        <p className="section-subtitle">Meet our newest arrivals looking for their forever homes</p>
        {loading ? (
          <div className="loading-animals">Loading animals...</div>
        ) : recentAnimals.length > 0 ? (
          <>
            <div className="recent-animals-grid">
              {recentAnimals.map((animal) => (
                <Link 
                  key={animal._id} 
                  to={`/animal/${animal._id}`} 
                  className="recent-animal-card"
                >
                  <div className="recent-animal-image">
                    <img src={animal.img} alt={animal.name || "Animal"} />
                    <div className="animal-card-overlay">
                      <span className="animal-adoption-badge">
                        {animal.adoption_type === "Permanent" ? "Permanent Adoption" : 
                         animal.adoption_type === "Foster" ? "Foster Care" : 
                         animal.adoption_type || "Adoption"}
                      </span>
                      {(animal.adoption_type === "Foster" || animal.adoption_type === "Foster Care") && animal.foster_duration && (
                        <span className="animal-foster-duration">
                          ⏱️ {animal.foster_duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="recent-animal-info">
                    <h3>{animal.name || "Unnamed"}</h3>
                    <p className="animal-type">{animal.type || animal.animal || ""}</p>
                    <div className="animal-tags">
                      {animal.category && <span className="animal-tag">{animal.animal}</span>}
                      {animal.age && <span className="animal-tag">Age: {animal.age}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/animalCatalog" className="see-all-link">
              See All Animals →
            </Link>
          </>
        ) : (
          <div className="no-animals">No animals available at the moment.</div>
        )}
      </section>

      {/* What We Do Section */}
      <section className="what-we-do">
        <div className="what-we-do-content">
          <h2 className="section-title">What We Do</h2>
          <ul className="what-we-do-list">
            <li>Rescue animals from the streets and unsafe environments.</li>
            <li>Provide shelter and care for animals from abusive or neglectful homes.</li>
            <li>Offer temporary housing when owners are unable to care for their pets.</li>
            <li>Match animals with loving, stable permanent homes.</li>
            <li>Give every animal medical care, emotional support, and proper rehabilitation.</li>
          </ul>
        </div>
      </section>

      {/* How Adoption Works Section */}
      <section className="adoption-steps">
        <h2 className="section-title">How Adoption Works</h2>
        <div className="steps-grid">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Browse Available Animals</h3>
            <p>Explore our catalog to find animals that match your lifestyle and preferences.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>Learn About Your Match</h3>
            <p>Read detailed profiles to understand each animal's needs and personality.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Contact Our Shelter</h3>
            <p>Reach out to us to schedule a meeting and discuss adoption details.</p>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <h3>Welcome Home</h3>
            <p>Take your new companion home and begin your journey together!</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Whether you're considering adoption, fostering, or want to support us in other ways, we're here to help. Every contribution makes a difference in the lives of animals in need.</p>
          <div className="cta-buttons">
            <Link to="/AboutUs" className="cta-button secondary">
              Learn More About Us
            </Link>
            <Link to="/volunteer" className="cta-button primary">
              Volunteer
            </Link>
            <Link to="/donate" className="cta-button primary">
              Donate
            </Link>
            <Link to="/report" className="cta-button primary report-cta-button">
              Report Animal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;