import { Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Register from "./Pages/Register/register";
import Login from "./Pages/Login/login";
import Home from "./Pages/Home/Home";
import Layout from "./Components/Layout/Layout";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
