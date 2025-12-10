import { useContext } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthProvider";
import ProductCard from "./ProductCard";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import axiosClient from "../utils/axiosClient";

export default function Products() {
  const { allProducts } = useContext(AuthContext);

  const [productList, setProductList] = useState([]);
  const [skip, setSkip] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const limit = 100;
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

const fetchProducts = async (reset = false) => {
  setLoading(true);
  try {
    const response = await axiosClient.get(
      `/products/getProductList?skip=${reset ? 0 : skip}&limit=${limit}&search=${searchInput}`
    );

    if (reset) {
      setProductList(response.data);
    } else {
      setProductList(prev => [...prev, ...response.data]); 
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, [skip]);

  useEffect(() => {
    setSkip(0);
    setProductList([]);

    const delayDebounce = setTimeout(() => {
      fetchProducts(true);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
        setSkip((prev) => prev + limit);
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [loading]);


  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full min-h-[calc(100vh-65px)] max-h-[calc(100vh-65px)] overflow-y-scroll p-4 bg-gray-200">
        {!productList ? (
                    <div className="py-3 px-4 mt-5 flex flex-row gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <div className="overflow-x-auto w-full bg-white rounded-md">
              <div className="p-6 ">
                <div className="flex justify-between items-center ">
                  <div>
                    <NavLink
                      to={"/admin/artikel/artikelAnlegen"}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                    >
                      Neuer Artikel +
                    </NavLink>
                  </div>
                  <div className="relative">
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
                      onChange={(e) => setSearchInput(e.target.value)}
                      onFocus={() => setSearchInput("")}
                      type="text"
                      value={searchInput}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-[450px] "
                      placeholder="Artikelnummer oder Bezeichnung eingeben..."
                    />
                  </div>
                </div>
              </div>

              <div
                ref={containerRef}
                className="overflow-x-auto min-h-[calc(100vh-235px)] max-h-[calc(100vh-235px)] overflow-y-scroll"
              >
                <table className="w-full bg-white shadow-md rounded-md border-t border-gray-200 w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b">
                      <th className="px-6 py-4 text-left text-gray-600 font-medium w-[50%]">
                        Artikel
                      </th>
                      <th className="px-6 py-4 text-center text-gray-600 font-medium w-[12.5%]">
                        Enthält Notizen
                      </th>
                      <th className="px-6 py-4 text-center text-gray-600 font-medium w-[12.5%]">
                        Verwandte Artikel
                      </th>
                      <th className="px-6 py-4 text-center text-gray-600 font-medium w-[12.5%]">
                        Bildquelle
                      </th>
                      <th className="px-6 py-4 text-center text-gray-600 font-medium w-[12.5%]">
                        Verwaltung
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((product, index) => (
                      <ProductCard key={index} product={product} />
                    ))}
                  </tbody>
                </table>
                {loading && (
                  <div className="flex justify-center mt-6 py-3 px-4 flex flex-row gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                )}
              </div>
              <div className="py-3 px-4 tracking-wide flex justify-end border-t border-gray-200">
                {!allProducts ? (
                  <div className="py-3 px-4 flex flex-row gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                ) : (
                  <p>
                    Die Datenbank besteht aus{" "}
                    <span className="text-sm font-bold text-gray-700">
                      {allProducts?.length}
                    </span>{" "}
                    Artikeln
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}
