import { useEffect, useState } from "react";
import axios from "axios";
import "./AnimalCatalog.css"; 
import { Link } from "react-router-dom";

const AnimalCatalog = () => {
  const [animals, setAnimals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.ceil(animals.length / cardsPerPage);
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentAnimals = animals.slice(indexOfFirstCard, indexOfLastCard);

  const pageNumbers = [];
  const startPage = Math.max(currentPage - 3, 1);
  const endPage = Math.min(currentPage + 4, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="animal-catalog-container">
      <div className="catalog-cards">
        {currentAnimals.map((animal) => (
          <Link 
            key={animal._id} 
            to={`/animal/${animal._id}`} 
            className="catalog-card-link"
          >
            <div className="catalog-card">
              <div className="catalog-image">
                <img src={animal.img} alt={animal.name} />
              </div>
              <h3>{animal.name || ""}</h3>
              <p>{animal.type || ""}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="catalog-pagination">
  {/* Jump to first page */}
  {currentPage > 1 && (
    <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
  )}

  {/* Previous page */}
  {currentPage > 1 && (
    <button onClick={() => setCurrentPage(currentPage - 1)}>{"<"}</button>
  )}

  {/* Page numbers */}
  {pageNumbers.map((num) => (
    <button
      key={num}
      onClick={() => setCurrentPage(num)}
      className={currentPage === num ? "active-page" : ""}
    >
      {num}
    </button>
  ))}

  {/* Next page */}
  {currentPage < totalPages && (
    <button onClick={() => setCurrentPage(currentPage + 1)}>{">"}</button>
  )}

  {/* Jump to last page */}
  {currentPage < totalPages && (
    <button onClick={() => setCurrentPage(totalPages)}>{">>"}</button>
  )}
</div>
    </div>
  );
};

export default AnimalCatalog;