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
import CreateProduct from "./components/administrator/CreateProduct";
import UserUpdate from "./components/administrator/UserUpdate";
import ProductUpdate from "./components/administrator/ProductUpdate";
import Authorize from "./components/protectedRoutes/Authorize";
import ActivationSuccess from "./components/ActivationSuccess";
import ActivationError from "./components/ActivationError";
import ActivationExpired from "./components/ActivationExpired";

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
        <Route path="/activation-success" element={<ActivationSuccess />} />
        <Route path="/activation-error" element={<ActivationError />} />
        <Route path="/activation-expired" element={<ActivationExpired />} />

        <Route path="/" element={<Protected />}>
          <Route path="/artikel/suche" element={<ProductSearch />} />
          <Route path="/artikel/melden" element={<MissingProduct />} />
          <Route path="/admin" element={<Authorize role="mucAdmin" />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="artikel/artikelAnlegen" element={<CreateProduct />} />
            <Route path="foto-meldungen" element={<PhotoReports />} />
            <Route path="artikel-meldungen" element={<ProductReports />} />
            <Route path="benutzer" element={<UserList />} />
            <Route path="benutzer/registrieren" element={<Register />} />
            <Route path="benutzer/bearbeiten/:id" element={<UserUpdate />} />
            <Route path="artikel" element={<Products />} />
            <Route path="artikel/bearbeiten/:id" element={<ProductUpdate />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
