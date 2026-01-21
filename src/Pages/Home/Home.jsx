import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [featuredAnimals, setFeaturedAnimals] = useState([]);
useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/animal");
        setFeaturedAnimals(res.data);
      } catch (err) {
        console.error("Failed to load animals");
      }
    };
    fetchAnimals();
  }, []);
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Waiting for a Home</h1>
          <p>Not every home is quiet, and not every animal gets a fair start. We help animals find the people they belong with — maybe that's you.</p>
          <Link to="/animalCatalog" className="hero-button">
            View Animals
          </Link>
        </div>
      </section>

      {/* Featured Animals Section */}
      <section className="featured">
        <h2>Meet a Few of Our Animals</h2>
        <div className="featured-cards">
          {featuredAnimals.slice(featuredAnimals.length-8).map((animal) => (
            <div key={animal.id} className="featured-card">
              {animal.image && <img src={animal.image} alt={animal.name} />}
              <h3>{animal.name}</h3>
            </div>
          ))}
        </div>
        <Link to="/animalCatalog" className="see-more">
          See all animals →
        </Link>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Why Adopt From Us?</h2>
        <p>Our shelter is dedicated to providing compassionate care for animals in need. We ensure every animal receives proper medical attention, nutrition, and love. By adopting from us, you're not just finding a pet—you're giving a second chance to an animal that deserves a loving home. Our trained staff is here to help match you with the perfect companion.</p>
      </section>

      {/* How Adoption Works Section */}
      <section className="steps">
        <h2>How Adoption Works</h2>
        <ol className="steps-list">
          <li>Browse available animals</li>
          <li>Contact our shelter</li>
          <li>Meet your new friend</li>
          <li>Take them home</li>
        </ol>
      </section>

    </div>
  );
};

export default Home;