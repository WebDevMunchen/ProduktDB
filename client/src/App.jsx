import { Routes, Route } from "react-router-dom";
import Protected from "./components/protectedRoutes/Protected";
import ProductSearch from "./components/ProductSearch";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { Bounce, ToastContainer } from "react-toastify";
import Dashboard from "./components/administrator/Dashboard";
import MissingProduct from "./components/MissingProduct";
import PhotoReports from "./components/administrator/PhotoReports";
import ProductReports from "./components/administrator/ProductReports";
import UserList from "./components/administrator/UserList";
import Register from "./components/administrator/Register";
import Products from "./components/administrator/Products";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Protected />}>
          <Route path="/benutzer" element={<UserList />} />
          <Route path="/benutzer/registrieren" element={<Register />} />
          <Route path="/artikel" element={<Products />} />
          <Route path="/artikel/suche" element={<ProductSearch />} />
          <Route path="/artikel/melden" element={<MissingProduct />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/foto-meldungen" element={<PhotoReports />} />
          <Route path="/artikel-meldungen" element={<ProductReports />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
