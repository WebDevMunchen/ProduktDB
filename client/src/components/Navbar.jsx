import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";

export default function Navbar() {
  const { isLoading, user, logout } = useContext(AuthContext);

  console.log(user);

  return (
    <>
      {!isLoading && (
        <nav className="flex h-[65px] justify-between lg:justify-between bg-gray-800 text-white w-full">
          <div className="px-2 xl:flex items-center">
            <NavLink to={"/"}>
              <img
                className="max-w-none h-16"
                src="https://res.cloudinary.com/dtrymbvrp/image/upload/v1720595800/logo_profile_b5hxd7.png"
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
                  to={"/dashboard"}
                  className="flex px-4 mx-auto font-semibold font-heading space-x-12"
                >
                  Dashboard
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
          ) : (
            <ul className="px-2 xl:px-12 py-3 flex items-center">
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
