import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthProvider";
import logo from "../assets/rent_group_logo.jpg";
import axiosClient from "./utils/axiosClient";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
export default function ProductSearch() {
  const { setProductId, product, allProducts, productId } =
    useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    axiosClient
      .post(`products/reportMissingPhoto/${productId}`)
      .then(() => {
        toast.success("Übermittelt!");
      })
      .catch((error) => {
        toast.error("Fehlgeschlagen!");
      })
      .finally(() => {
        setIsLoading(false);
        setProductId("");
      });
  };

  const handleFocus = () => {
    setInputValue("");
    setProductId("");
    setSuggestions([]);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await axiosClient
      .post(`/products/reportIssue/${productId}`, data)
      .then(() => {
        toast.success("Übermittelt!");
      })
      .catch((error) => {
        console.error(err);
        toast.error("Fehlgeschlagen!");
      });
  };

  return (
    <div className="max-w-2xl px-4 mx-auto my-10 font-sans min-h-[100vh]">
      <div className="relative w-full">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Gib die Artikelnummer ein"
          className="w-full text-center py-2 text-lg border border-gray-300 rounded-t-xl shadow-sm focus:ring-1 outline-none"
        />

        {suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 text-center border border-gray-200 rounded-b-xl shadow-md bg-white divide-y max-h-48 overflow-y-auto z-50">
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
      </div>

      {!product ? (
        <div className="min-h-[60vh] flex justify-center items-center w-full border-l border-r border-b border-gray-300 rounded-b-xl">
          <img src={logo} alt="rent group logo" className="w-[60%] h-[50%]" />
        </div>
      ) : (
        <div className="p-4 border-l border-r border-b border-gray-300 rounded-b-xl shadow-lg bg-white text-center">
          <div className="flex justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={36}
              height={36}
              viewBox="0 0 24 24"
              className="invisible"
            >
              <path
                fill="#dda528"
                fillRule="evenodd"
                d="m21.268 21.053l-18.536.001a1 1 0 0 1-.866-1.5L11.132 3.5a1 1 0 0 1 1.732 0l9.27 16.053a1 1 0 0 1-.866 1.5M11.248 9.545l.116 5.666h1.272l.117-5.666zm.75 8.572c.48 0 .855-.369.855-.832s-.375-.826-.856-.826a.83.83 0 0 0-.85.826c0 .463.375.832.85.832z"
              ></path>
            </svg>
            <p className="text-3xl font-semibold text-gray-900 tracking-wider pb-3">
              {product.productNumber}
            </p>
            <button
              onClick={() => document.getElementById("reportModal").showModal()}
              className="p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={36}
                height={36}
                viewBox="0 0 24 24"
              >
                <path
                  fill="#dda528"
                  fillRule="evenodd"
                  d="m21.268 21.053l-18.536.001a1 1 0 0 1-.866-1.5L11.132 3.5a1 1 0 0 1 1.732 0l9.27 16.053a1 1 0 0 1-.866 1.5M11.248 9.545l.116 5.666h1.272l.117-5.666zm.75 8.572c.48 0 .855-.369.855-.832s-.375-.826-.856-.826a.83.83 0 0 0-.85.826c0 .463.375.832.85.832z"
                ></path>
              </svg>
            </button>
            {/* modal */}

            <dialog id="reportModal" className="modal">
              <div className="modal-action min-w-[450px] ">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="modal-box flex flex-col gap-4"
                >
                  <h3 className="font-bold text-lg">
                    Problem mit dem Artikel melden
                  </h3>

                  <input
                    type="text"
                    placeholder="Gib deinen Namen ein"
                    {...register("reportedBy", { required: true })}
                    className="input input-bordered w-full"
                  />

                  <textarea
                    placeholder="Beschreibe das Problem bzw. den Fehler mit dem Artikel"
                    {...register("reason", { required: true })}
                    className="textarea textarea-bordered w-full"
                  />

                  <div className="modal-action">
                    <button
                      type="submit"
                      className="btn tracking-wider bg-green-700 text-white hover:bg-green-600"
                      onClick={() =>
                        document.getElementById("reportModal").close()
                      }
                    >
                      Übermitteln
                    </button>
                    <button
                      onClick={() =>
                        document.getElementById("reportModal").close()
                      }
                      type="button"
                      className="btn tracking-wider hover:bg-red-600 hover:text-white"
                    >
                      Abbrechen
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
          <p className="text-xl font-semibold text-gray-800 mt-3 md:px-16">
            {product.title}
          </p>
          {!imageError && product.image ? (
            <img
              src={`${product.image}?v=${Date.now()}`}
              alt={`Product ${product.productNumber}`}
              className="w-full max-h-[100%] object-contain rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : product.imageReported ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <p className="text-red-500">
                Das fehlende Bild wurde bereits gemeldet und wird so bald wie
                möglich aktualisiert!
              </p>
            </div>
          ) : (
            <>
              <p className="mt-2 py-12 text-xl">
                Aktuell gibt es kein Bild für diesen Artikel!
              </p>
              <button
                onClick={handleReport}
                disabled={isLoading}
                className={`mt-4 px-4 py-2 text-white text-lg rounded-lg transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isLoading ? "Bitte warten" : "Fehlendes Bild melden"}
              </button>
            </>
          )}
          {product.notes && (
            <p className="mt-2 text-red-500 italic md:px-16">{product.notes}</p>
          )}

          {product.relatedProduct?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Verwandte Produkte
              </h3>
              <div
                className={`flex ${
                  product.relatedProduct.length <= 2
                    ? "justify-center gap-4"
                    : "justify-start gap-4 overflow-x-auto md:justify-center"
                }`}
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
