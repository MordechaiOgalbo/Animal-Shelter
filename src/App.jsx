import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [animals, setAnimals] = useState([]);
  useEffect(() => {
    async function fetchAnimals() {
      try {
        const res = await axios.get("http://localhost:5000/api/animal/");
      setAnimals(res.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
        
      }
      
      
    }
    fetchAnimals()
  }, []);
  return <div>{animals.map((animal) => <div key={animal._id}> {animal.name} </div>)}</div>;
}

export default App;
