import { useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthProvider";
import ProductCard from "./ProductCard";
import { NavLink } from "react-router-dom";

export default function Products() {
  const { paginatedProducts } = useContext(AuthContext);

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll p-4 bg-gray-200">
        {!paginatedProducts ? (
          <>Loading...</>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="overflow-x-auto w-full bg-white">
              <div className="p-6">
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
                      Neuer Artikel +
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
                      // onChange={handleSearch}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-[450px] "
                      placeholder="Artikelnummer oder Bezeichnung eingeben..."
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto min-h-[calc(100vh-305px)] max-h-[calc(100vh-305px)] overflow-y-scroll">
                <table className="w-full bg-white shadow-md rounded-md border-t border-gray-200 w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="px-6 py-4 text-left text-gray-600 font-medium">
                        Artikel
                      </th>
                      <th className="px-6 py-4 text-left text-gray-600 font-medium">
                        Enthält Notizen
                      </th>
                      <th className="px-6 py-4 text-left text-gray-600 font-medium">
                        Verwandte Artikel
                      </th>
                      <th className="px-6 py-4 text-left text-gray-600 font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p>Pagination comes here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
