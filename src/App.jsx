import { Route, Routes } from "react-router-dom";
import Register from "./Pages/Register/register";
import Login from "./Pages/Login/Login";
import AnimalCatalog from "./Pages/AnimalCatalog/AnimalCatalog";
import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/AboutUs/AboutUs"
import Layout from "./Components/Layout/Layout";
import AnimalPage from "./Pages/AnimalPage/AnimalPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="animalCatalog" element={<AnimalCatalog />} />
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="Animal/:id" element= {<AnimalPage/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
