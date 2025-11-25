import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";
import logo from "../assets/logo.png"

export default function Navbar() {
  const { isLoading, user, logout } = useContext(AuthContext);

  return (
    <>
      {!isLoading && (
        <nav className="flex h-[65px] justify-between lg:justify-between bg-gray-800 text-white w-full">
          <div className="min-w-[200px] max-w-[200px] xl:flex justify-center items-center">
            <NavLink to={"/admin/dashboard"}>
              <img
                className="max-h-[40px]"
                src={logo}
                alt="logo"
              />
            </NavLink>
          </div>

          {!user ? (
            <></>
          ) : user.role === "mucAdmin" ? (
            <ul className="px-2 xl:px-12 py-3 flex items-center">
              <li>
                <NavLink
                  to={"/"}
                  onClick={() => {
                    logout();
                  }}
                  className="flex px-4 mx-auto font-semibold font-heading space-x-12"
                >
                  Abmelden
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="px-2 xl:px-12 py-3 flex items-center">
              <li>
                <NavLink
                  to={"/artikel/suche"}
                  className="flex px-4 mx-auto font-semibold font-heading space-x-12"
                >
                  Artikelsuche
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/artikel/melden"}
                  className="flex px-4 mx-auto font-semibold font-heading space-x-12"
                >
                  Artikelmeldung
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/"}
                  onClick={() => {
                    logout();
                  }}
                  className="flex px-4 mx-auto font-semibold font-heading space-x-12"
                >
                  Abmelden
                </NavLink>
              </li>
            </ul>
          )}
        </nav>
      )}
    </>
  );
}
