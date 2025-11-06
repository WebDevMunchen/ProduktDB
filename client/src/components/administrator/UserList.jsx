import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { NavLink } from "react-router-dom";
import UserCard from "./UserCard";
import axiosClient from "../utils/axiosClient";

export default function UserList() {
  const [allUsers, setAllUsers] = useState("");
  const [searchParameter, setSearchParameter] = useState("");
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [startCount, setStartCount] = useState(1);
  const [limitCount, setLimitCount] = useState(5);
  const [location, setLocation] = useState("");
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(true);

  console.log(allUsers);

  useEffect(() => {
    axiosClient
      .get(
        `/user/getAllUsers?search=${searchParameter}&location=${location}&limit=${limit}&skip=${skip}`
      )
      .then((response) => {
        setAllUsers(response.data);
      })
      .catch((error) => {
        setAllUsers(null);
      });
  }, [searchParameter, location, limit]);

  const handleSearch = (e) => {
    setSearchParameter(e.target.value);
  };

  const handleNextPage = () => {
    setLimitCount(limitCount + limit);
    setStartCount(limitCount + 1);

    if (startCount > 1) {
      setDisablePrev(false);
    }
  };

  const handlePreviousPage = () => {
    setLimitCount(limitCount - limit);
    setStartCount(limitCount - (2 * limit - 1));

    console.log(limitCount - (2 * limit - 1));

    if (limitCount - (2 * limit - 1) === 1) {
      setDisablePrev(true);
    }
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
                    to={"/benutzer/registrieren"}
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

            <div className="overflow-x-auto min-h-[calc(100vh-305px)] max-h-[calc(100vh-305px)] overflow-y-scroll">
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
                    <>Loading...</>
                  ) : (
                    allUsers.map((user) => {
                      return (
                        <tr className="hover:bg-gray-50 transition-colors duration-150">
                          <UserCard key={user.id} user={user} />
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="rounded-md bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between flex-col sm:flex-row">
                <div className="mb-4 sm:mb-0">
                  {allUsers.length === 0 ? (
                    <p className="text-sm text-gray-700">
                      Keine Benutzer gefunden
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700">
                      Ergebnisse{" "}
                      <span className="font-medium">{startCount}</span> bis{" "}
                      {allUsers.length <= limit ? (
                        <span className="font-medium">{limitCount}</span>
                      ) : (
                        <span className="font-medium">20</span>
                      )}{" "}
                      von <span className="font-medium">{allUsers.length}</span>{" "}
                      Benutzern
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    Anzahl pro Seite:
                  </p>
                  <select
                    onChange={(e) => setLimit(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2  w-full sm:w-auto hover:cursor-pointer"
                  >
                    <option value={5}>5</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={999999}>Alle</option>
                  </select>

                  <div className="ml-4 flex gap-2">
                    <button disabled={disablePrev} onClick={handlePreviousPage}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        className="hover:cursor-pointer hover:text-red-500 transition duration-150 ease-in-out"
                      >
                        <path
                          fill="currentColor"
                          d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"
                        ></path>
                      </svg>
                    </button>
                    <button onClick={handleNextPage}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        className="hover:cursor-pointer hover:text-red-500 transition duration-150 ease-in-out"
                      >
                        <path
                          fill="currentColor"
                          d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
