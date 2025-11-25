import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { NavLink } from "react-router-dom";
import UserCard from "./UserCard";
import axiosClient from "../utils/axiosClient";

export default function UserList() {
  const [allUsers, setAllUsers] = useState("");
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [searchParameter, setSearchParameter] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    axiosClient
      .get(`/user/getAllUsers?search=${searchParameter}&location=${location}`)
      .then((response) => {
        setAllUsers(response.data);

        return axiosClient.get(`/user/getAllUsers`);
      })
      .then((response) => {
        setAllUsersCount(response.data);
      })
      .catch((error) => {
        setAllUsers([]);
      });
  }, [searchParameter, location]);

  const handleSearch = (e) => {
    setSearchParameter(e.target.value);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] py-4 bg-gray-200">
        <div className="flex justify-center px-4">
          <div className="bg-white w-full rounded-md shadow-md ">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Benutzerübersicht
                  </h2>
                </div>
                <div className="mt-4 md:mt-0">
                  <NavLink
                    to={"/admin/benutzer/registrieren"}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                  >
                    Neuer Benutzer +
                  </NavLink>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-[300px] "
                    placeholder="Suchen..."
                  />
                </div>
                <div>
                  <select
                    onChange={(e) => setLocation(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2  w-full sm:w-auto hover:cursor-pointer"
                  >
                    <option value="">Alle Standorte</option>
                    <option value="München">München</option>
                    <option value="Bocholt">Bocholt</option>
                    <option value="Berlin">Berlin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[calc(100vh-285px)] max-h-[calc(100vh-305px)] overflow-y-scroll">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left   text-sm font-medium text-gray-500   tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left   text-sm font-medium text-gray-500   tracking-wider"
                    >
                      Benutzer-ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left   text-sm font-medium text-gray-500   tracking-wider"
                    >
                      Standort
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left   text-sm font-medium text-gray-500   tracking-wider"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left   text-sm font-medium text-gray-500   tracking-wider"
                    >
                      Rolle
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left   text-sm font-medium text-gray-500   tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center   text-sm font-medium text-gray-500   tracking-wider"
                    >
                      Verwaltung
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!allUsers ? (
                    <tr>
                      <td colSpan="100%">
                        <div className="py-3 px-4 mt-5 flex flex-row gap-2 justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    allUsers.map((user) => {
                      return (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <UserCard user={user} setAllUsers={setAllUsers} searchParameter={searchParameter} location={location}/>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="rounded-b-md bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-end flex-col sm:flex-row">
                <div className="mb-4 sm:mb-0">
                  {allUsers.length === 0 ? (
                    <p className="text-sm text-gray-700">
                      Keine Benutzer gefunden
                    </p>
                  ) : allUsers.length === allUsersCount.length ? (
                    <p className="text-sm text-gray-700">
                      Insgesamt{" "}
                      <span className="font-medium">
                        {allUsersCount.length}
                      </span>{" "}
                      Benutzer
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{allUsers.length}</span> von
                      insgesamt{" "}
                      <span className="font-medium">
                        {allUsersCount.length}
                      </span>{" "}
                      Benutzern gefunden
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
