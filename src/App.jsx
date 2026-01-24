import { Route, Routes } from "react-router-dom";
import Register from "./Pages/Register/register";
import Login from "./Pages/Login/Login";
import AnimalCatalog from "./Pages/AnimalCatalog/AnimalCatalog";
import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Volunteer from "./Pages/Volunteer/Volunteer";
import Donate from "./Pages/Donate/Donate";
import ReportAnimal from "./Pages/ReportAnimal/ReportAnimal";
import SubmitAnimal from "./Pages/SubmitAnimal/SubmitAnimal";
import Layout from "./Components/Layout/Layout";
import AnimalPage from "./Pages/AnimalPage/AnimalPage";
import Profile from "./Pages/Profile/Profile";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="animalCatalog" element={<AnimalCatalog />} />
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="donate" element={<Donate />} />
          <Route path="report" element={<ReportAnimal />} />
          <Route path="submit" element={<SubmitAnimal />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="animal/:id" element= {<AnimalPage/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
