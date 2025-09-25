import { Routes, Route } from "react-router-dom";
import Protected from "./components/protectedRoutes/Protected";
import ProductSearch from "./components/ProductSearch";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
          <Route path="/produkte/suche" element={<ProductSearch />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
