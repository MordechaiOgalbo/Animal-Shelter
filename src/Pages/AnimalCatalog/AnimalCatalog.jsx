import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AnimalCatalog.css"; 
import { Link } from "react-router-dom";

const AnimalCatalog = () => {
  const [animals, setAnimals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [selectedTameness, setSelectedTameness] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [fosterDurationMin, setFosterDurationMin] = useState("");
  const [fosterDurationMax, setFosterDurationMax] = useState("");
  const [fosterDurationTimeframe, setFosterDurationTimeframe] = useState("All");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const cardsPerPage = 12;

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/animal");
        setAnimals(res.data);
      } catch (err) {
        console.error("Failed to load animals");
      }
    };
    fetchAnimals();
  }, []);

  useEffect(() => {
    // Check if user is logged in and fetch favorites
    const checkUserAndFavorites = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });
        setUser(res.data);
        
        // Fetch favorites
        const favoritesRes = await axios.get("http://localhost:5000/api/user/me/favorites", {
          withCredentials: true,
        });
        const favoriteIds = favoritesRes.data.favorites.map(fav => fav._id || fav);
        setFavorites(favoriteIds);
      } catch (error) {
        // User not logged in
        setUser(null);
        setFavorites([]);
      }
    };
    checkUserAndFavorites();
  }, []);

  // Get unique values for filters
  const categories = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.category).filter(Boolean))];
    return ["All", ...unique.sort()];
  }, [animals]);

  const types = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.type).filter(Boolean))];
    return ["All", ...unique.sort()];
  }, [animals]);

  const genders = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.gender).filter(Boolean))];
    return ["All", ...unique.sort()];
  }, [animals]);

  const tamenessLevels = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.tameness_level).filter(Boolean))];
    return ["All", ...unique.sort()];
  }, [animals]);

  const locations = useMemo(() => {
    const unique = [...new Set(animals.map(a => a.address).filter(Boolean))];
    return ["All", ...unique.sort()];
  }, [animals]);

  // Filter animals based on search and filters
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      // Search filter
      const matchesSearch = !searchQuery || 
        (animal.name && animal.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (animal.type && animal.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (animal.breed && animal.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (animal.animal && animal.animal.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === "All" || animal.category === selectedCategory;

      // Type filter
      const matchesType = selectedType === "All" || animal.type === selectedType;

      // Gender filter
      const matchesGender = selectedGender === "All" || animal.gender === selectedGender;

      // Age filter
      const age = animal.age || 0;
      const matchesMinAge = !minAge || age >= parseInt(minAge);
      const matchesMaxAge = !maxAge || age <= parseInt(maxAge);

      // Tameness filter
      const matchesTameness = selectedTameness === "All" || animal.tameness_level === selectedTameness;

      // Location filter
      const matchesLocation = selectedLocation === "All" || animal.address === selectedLocation;

      // Foster duration filter
      const matchesFosterDuration = (!fosterDurationMin && !fosterDurationMax && fosterDurationTimeframe === "All") || 
        (animal.foster_duration && 
         (() => {
           const duration = animal.foster_duration.toLowerCase();
           
           // Extract number from foster duration string
           const durationMatch = duration.match(/(\d+)/);
           const durationNumber = durationMatch ? parseInt(durationMatch[1]) : null;
           
           // Check timeframe
           const hasTimeframe = fosterDurationTimeframe === "All" || 
             (fosterDurationTimeframe === "Days" && (duration.includes("day") || duration.includes("d"))) ||
             (fosterDurationTimeframe === "Months" && (duration.includes("month") || duration.includes("mon"))) ||
             (fosterDurationTimeframe === "Years" && (duration.includes("year") || duration.includes("y")));
           
           // Check number range if timeframe matches or is "All"
           if (!hasTimeframe) return false;
           
           if (durationNumber === null) {
             // If no number found in duration, only match if no number filters are set
             return !fosterDurationMin && !fosterDurationMax;
           }
           
           const min = fosterDurationMin ? parseInt(fosterDurationMin) : null;
           const max = fosterDurationMax ? parseInt(fosterDurationMax) : null;
           
           const matchesMin = !min || durationNumber >= min;
           const matchesMax = !max || durationNumber <= max;
           
           return matchesMin && matchesMax;
         })());

      return matchesSearch && matchesCategory && matchesType && matchesGender && 
             matchesMinAge && matchesMaxAge && matchesTameness && matchesLocation && matchesFosterDuration;
    });
  }, [animals, searchQuery, selectedCategory, selectedType, selectedGender, minAge, maxAge, 
      selectedTameness, selectedLocation, fosterDurationMin, fosterDurationMax, fosterDurationTimeframe]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedType, selectedGender, minAge, maxAge, 
      selectedTameness, selectedLocation, fosterDurationMin, fosterDurationMax, fosterDurationTimeframe]);

  const totalPages = Math.ceil(filteredAnimals.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentAnimals = filteredAnimals.slice(indexOfFirstCard, indexOfLastCard);

  const pageNumbers = [];
  const startPage = Math.max(currentPage - 3, 1);
  const endPage = Math.min(currentPage + 4, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedGender("All");
    setMinAge("");
    setMaxAge("");
    setSelectedTameness("All");
    setSelectedLocation("All");
    setFosterDurationMin("");
    setFosterDurationMax("");
    setFosterDurationTimeframe("All");
  };

  // Validation: Ensure min is not higher than max
  const handleFosterDurationMinChange = (value) => {
    setFosterDurationMin(value);
    if (value && fosterDurationMax && parseInt(value) > parseInt(fosterDurationMax)) {
      setFosterDurationMax(value);
    }
  };

  const handleFosterDurationMaxChange = (value) => {
    setFosterDurationMax(value);
    if (value && fosterDurationMin && parseInt(value) < parseInt(fosterDurationMin)) {
      setFosterDurationMin(value);
    }
  };

  return (
    <div className="animal-catalog-container">
      <div className="catalog-header">
        <h1 className="catalog-title">Animal Catalog</h1>
        <p className="catalog-subtitle">Find your perfect companion</p>
      </div>

      <div className="catalog-filters">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by name, type, breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div
          className="advanced-search-toggle"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          {showAdvancedSearch ? "▼ Hide Advanced Search" : "▶ Advanced Search"}
        </div>

        <div className={`advanced-filters-container ${showAdvancedSearch ? 'open' : 'closed'}`}>
          <div className="filters-row">
            <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="gender-filter">Gender</label>
            <select
              id="gender-filter"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="filter-select"
            >
              {genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>

          <div className="filter-group age-filter">
            <label>Age Range</label>
            <div className="age-inputs">
              <input
                type="number"
                placeholder="Min"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                className="age-input"
                min="0"
              />
              <span className="age-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                className="age-input"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="tameness-filter">Tameness</label>
            <select
              id="tameness-filter"
              value={selectedTameness}
              onChange={(e) => setSelectedTameness(e.target.value)}
              className="filter-select"
            >
              {tamenessLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="location-filter">Location</label>
            <select
              id="location-filter"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="filter-select"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="filter-group foster-duration-filter">
            <label htmlFor="foster-duration-filter">Foster Duration</label>
            <div className="foster-duration-inputs">
              <input
                id="foster-duration-min"
                type="number"
                placeholder="Min"
                value={fosterDurationMin}
                onChange={(e) => handleFosterDurationMinChange(e.target.value)}
                className="foster-duration-number"
                min="0"
              />
              <span className="age-separator">-</span>
              <input
                id="foster-duration-max"
                type="number"
                placeholder="Max"
                value={fosterDurationMax}
                onChange={(e) => handleFosterDurationMaxChange(e.target.value)}
                className="foster-duration-number"
                min="0"
              />
              <select
                id="foster-duration-timeframe"
                value={fosterDurationTimeframe}
                onChange={(e) => setFosterDurationTimeframe(e.target.value)}
                className="foster-duration-timeframe"
              >
                <option value="All">All</option>
                <option value="Days">Days</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>
        </div>

        <div className="results-count">
          Showing {filteredAnimals.length} of {animals.length} animals
        </div>
      </div>

      {currentAnimals.length === 0 ? (
        <div className="no-results">
          <p>No animals found matching your criteria.</p>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="catalog-cards">
            {currentAnimals.map((animal) => {
              const isFavorite = favorites.includes(animal._id);
              
              const handleToggleFavorite = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (!user) {
                  toast.error("Please login to add animals to your favorites");
                  return;
                }
                
                try {
                  if (isFavorite) {
                    await axios.delete("http://localhost:5000/api/user/me/favorites", {
                      data: { animalId: animal._id },
                      headers: {
                        "Content-Type": "application/json",
                      },
                      withCredentials: true,
                    });
                    setFavorites(favorites.filter(id => id !== animal._id));
                    toast.success("Removed from Adoption Candidates");
                  } else {
                    await axios.post("http://localhost:5000/api/user/me/favorites", {
                      animalId: animal._id,
                    }, {
                      headers: {
                        "Content-Type": "application/json",
                      },
                      withCredentials: true,
                    });
                    setFavorites([...favorites, animal._id]);
                    toast.success("Added to Adoption Candidates");
                  }
                } catch (error) {
                  console.error("Error toggling favorite:", error);
                  toast.error(error.response?.data?.error || "Failed to update favorites");
                }
              };

              return (
                <div key={animal._id} className="catalog-card-wrapper">
                  <Link 
                    to={`/animal/${animal._id}`} 
                    className="catalog-card-link"
                  >
                    <div className="catalog-card">
                      <div className="catalog-image">
                        {user && (
                          <button
                            onClick={handleToggleFavorite}
                            className={`favorite-heart-btn ${isFavorite ? "favorited" : ""}`}
                            title={isFavorite ? "Remove from Adoption Candidates" : "Add to Adoption Candidates"}
                          >
                            {isFavorite ? "❤️" : "🤍"}
                          </button>
                        )}
                        <img src={animal.img} alt={animal.name} />
                        <div className="card-overlay">
                          <span className="card-adoption-type">
                            {animal.adoption_type === "Permanent" ? "Permanent Adoption" : 
                             animal.adoption_type === "Foster" ? "Foster Care" : 
                             animal.adoption_type || "Adoption"}
                          </span>
                          {(animal.adoption_type === "Foster" || animal.adoption_type === "Foster Care") && animal.foster_duration && (
                            <span className="card-foster-duration">
                              ⏱️ {animal.foster_duration}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="card-content">
                        <h3>{animal.name || "Unnamed"}</h3>
                        <p className="card-type">{animal.type || ""}</p>
                        <div className="card-details">
                          {animal.category && <span className="card-badge">{animal.category}</span>}
                          <span className="card-badge">{animal.animal || animal.type || ""}</span>
                          {animal.breed && <span className="card-badge">Breed: {animal.breed}</span>}
                          {animal.age && <span className="card-badge">Age: {animal.age}</span>}
                          {animal.gender && (
                            <span className="card-badge">
                              Gender: {animal.gender}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="catalog-pagination">
              {currentPage > 1 && (
                <button onClick={() => setCurrentPage(1)} className="pagination-btn" title="First page">
                  {"<<"}
                </button>
              )}

              {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage - 1)} className="pagination-btn" title="Previous page">
                  {"<"}
                </button>
              )}

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`pagination-btn ${currentPage === num ? "active-page" : ""}`}
                >
                  {num}
                </button>
              ))}

              {currentPage < totalPages && (
                <button onClick={() => setCurrentPage(currentPage + 1)} className="pagination-btn" title="Next page">
                  {">"}
                </button>
              )}

              {currentPage < totalPages && (
                <button onClick={() => setCurrentPage(totalPages)} className="pagination-btn" title="Last page">
                  {">>"}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnimalCatalog;