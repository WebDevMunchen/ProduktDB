import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthProvider";
import logo from "../assets/rent_group_logo.jpg";
import axiosClient from "./utils/axiosClient";

export default function Home() {
  const { setProductId, product, allProducts, productId } =
    useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [hasFocused, setHasFocused] = useState(false); // 👈 new state

  useEffect(() => {
    setImageError(false);
  }, [product]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts
      ?.filter((p) => p.productNumber.toString().startsWith(value))
      .map((p) => p.productNumber);

    setSuggestions(filtered || []);
  };

  const handleSelect = (number) => {
    setProductId(number);
    setInputValue(number);
    setSuggestions([]);
  };

  const handleReport = () => {
    axiosClient
      .post(`products/reportMissingPhoto/${productId}`)
      .then(() => {
        console.log("Reported");
      })
      .catch((error) => {
        console.log(error);
      });
  };

const handleFocus = () => {
  setInputValue("");      // clear the input
  setProductId(null);     // clear the selected product so the logo shows
  setSuggestions([]);     // clear any previous suggestions
};

  return (
    <div className="max-w-2xl px-4 mx-auto mt-10 font-sans min-h-[100vh]">
<input
  type="text"
  value={inputValue}
  onChange={handleChange}
  onFocus={handleFocus}
  placeholder="Enter product number"
  className="w-full text-center py-2 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
/>

      {suggestions.length > 0 && (
        <ul className="mt-2 text-center border border-gray-200 rounded-xl shadow-md bg-white divide-y max-h-48 overflow-y-auto">
          {suggestions.map((num) => (
            <li
              key={num}
              className="py-2 hover:bg-blue-50 cursor-pointer transition"
              onClick={() => handleSelect(num)}
            >
              {num}
            </li>
          ))}
        </ul>
      )}

      {!product ? (
        <img
          src={logo}
          alt="rent group logo"
          className="w-[60%] mx-auto mt-[30vh]"
        />
      ) : (
        <div className="mt-6 p-4 border border-gray-200 rounded-2xl shadow-lg bg-white text-center">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            Artikelnummer: {product.productNumber}
          </p>

          <p className="text-xl font-semibold text-gray-800">{product.title}</p>
          {!imageError && product.image ? (
            <img
              src={`${product.image}?v=${Date.now()}`}
              alt={`Product ${product.productNumber}`}
              className="w-full max-h-[100%] object-contain rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <>
              <p className="mt-2 py-12 text-xl">
                Aktuell gibt es kein Bild für diesen Artikel!
              </p>
              <button
                onClick={() => handleReport()}
                className="mt-4 px-4 py-2 bg-red-500 text-white text-lg rounded-lg hover:bg-red-600 transition"
              >
                Fehlendes Bild melden
              </button>
            </>
          )}
          {product.notes && (
            <p className="mt-2 text-red-500 italic">{product.notes}</p>
          )}

          {product.relatedProduct?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Verwandte Produkte
              </h3>
              <div
  className={`flex ${product.relatedProduct.length <= 2 ? "justify-center gap-4" : "justify-start gap-4 overflow-x-auto"}`}
>

                {product.relatedProduct.map((rp) => (
                  <div
                    key={rp._id}
                    className="inline-flex flex-col min-w-[150px] p-2 border rounded-xl shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() => {
                      setProductId(rp.productNumber);
                      setInputValue(rp.productNumber);
                    }}
                  >
                    <img
                      src={`${rp.image}?v=${Date.now()}`}
                      alt={`Related Product ${rp.productNumber}`}
                      className="w-full h-32 object-contain rounded-md mb-2"
                    />
                    <p className="text-md font-medium text-gray-700 mt-2">
                      {rp.productNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
