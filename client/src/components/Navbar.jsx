import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthProvider";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isLoading, user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  if (isLoading) return null;

  return (
    <nav className="bg-gray-800 text-white w-full h-[65px] flex justify-between items-center px-4 lg:px-12">
      <NavLink to="/admin/dashboard" className="flex items-center">
        <img src={logo} alt="logo" className="h-[35px] ml-2" />
      </NavLink>

      {user && user.role !== "mucAdmin" && (
        <ul className="hidden lg:flex space-x-6 items-center">
          <li>
            <NavLink
              to="/artikel/suche"
              className="font-semibold hover:text-gray-300"
              onClick={handleLinkClick}
            >
              Artikelsuche
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/artikel/melden"
              className="font-semibold hover:text-gray-300"
              onClick={handleLinkClick}
            >
              Artikel melden
            </NavLink>
          </li>
          <li>
            <button
              onClick={logout}
              className="font-semibold hover:text-gray-300"
            >
              Abmelden
            </button>
          </li>
        </ul>
      )}

      {user && user.role === "mucAdmin" && (
        <button
          onClick={logout}
          className="hidden lg:flex font-semibold hover:text-gray-300"
        >
          Abmelden
        </button>
      )}

      {user && user.role !== "mucAdmin" && (
        <div className="lg:hidden relative">
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center w-10 h-10 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {isOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-50 flex flex-col">
              <li>
                <NavLink
                  to="/artikel/suche"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Artikelsuche
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/artikel/melden"
                  onClick={handleLinkClick}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Artikel melden
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLinkClick();
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700"
                >
                  Abmelden
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}
